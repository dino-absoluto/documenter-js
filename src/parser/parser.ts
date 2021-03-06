/**
 * @author Dino <dinoabsoluto+dev@gmail.com>
 * @license
 * Copyright 2019 Dino <dinoabsoluto+dev@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/* imports */
import {
  ApiModel,
  ApiPackage,
  ApiNamespace,
  ApiItem,
  ApiItemKind,
  ApiDeclaredItem,
  ApiDocumentedItem,
  ApiClass,
  ApiProperty,
  ApiPropertySignature,
  ApiMethod,
  ApiMethodSignature,
  ApiEnum,
  ApiInterface,
  ApiParameterListMixin,
  ApiConstructor,
  ApiConstructSignature
} from '@microsoft/api-extractor-model'

import {
  DocNode,
  DocNodeKind,
  DocPlainText,
  DocSoftBreak,
  DocLinkTag,
  DocDeclarationReference,
  DocFencedCode,
  DocCodeSpan
} from '@microsoft/tsdoc'

import {
  Node,
  Document,
  Heading,
  FormattedBlock,
  FormattedSpan,
  BlockType,
  Span,
  LineBreak,
  Link,
  Table,
  TableRow,
  List,
  ListItem
} from '../ast'
import * as path from 'path'

/* code */

const trimNodes = (nodes: readonly DocNode[]): DocNode[] => {
  let start = 0
  for (const node of nodes) {
    if (node instanceof DocSoftBreak) {
      start++
      continue
    }
    break
  }
  let end = nodes.length
  for (let i = nodes.length - 1; i >= 0; --i) {
    if (nodes[i] instanceof DocSoftBreak) {
      end = i
      continue
    }
    break
  }
  return nodes.slice(start, end)
}

/**
 * The Parser.
 */
export class Parser {
  public readonly model = new ApiModel()
  public maxDepth = 1
  private pHeadings = new Map<ApiItem, Heading>()

  public loadPackage (filename: string): void {
    this.model.loadPackage(filename)
  }

  public resolveDeclaration (
    item: ApiItem,
    ref: DocDeclarationReference
  ): ApiItem {
    const result = this.model.resolveDeclarationReference(ref, item)
    if (result.resolvedApiItem) {
      return result.resolvedApiItem
    } else {
      throw new Error(result.errorMessage)
    }
  }

  private createLinkGetter (item: ApiItem): () => string {
    return (): string => {
      const heading = this.pHeadings.get(item)
      if (heading) {
        if (!heading.link) {
          throw new Error('Cannot resolve link: ' +
            item.getScopedNameWithinPackage())
        }
        let link = heading.link
        if (heading.parent instanceof Document &&
          !heading.parent.parent &&
          (!heading.previous || (
            heading.parent.first &&
            heading.parent.first.next === heading))
        ) {
          link = link.substring(0, link.lastIndexOf('#'))
        }
        return link
      }
      throw new Error('No heading found.')
    }
  }

  private getMembers (item: ApiItem): IterableIterator<ApiItem> {
    const members = (function * () {
      for (const mem of item.members) {
        if (mem.kind === ApiItemKind.EntryPoint) {
          yield * mem.members
        } else {
          yield mem
        }
      }
    })()
    return members
  }

  private parseDoc (item: ApiItem, node: DocNode): Node {
    switch (node.kind) {
      case DocNodeKind.PlainText: {
        const typed = node as DocPlainText
        return new Span(typed.text)
      }
      case DocNodeKind.SoftBreak:
        return new LineBreak()
      case DocNodeKind.Paragraph: {
        const children = trimNodes(node.getChildNodes())
          .map((n) => this.parseDoc(item, n))
        return new FormattedBlock(children)
      }
      case DocNodeKind.LinkTag: {
        const link = node as DocLinkTag
        if (link.codeDestination) {
          const dest = link.codeDestination
          const ref = this.resolveDeclaration(item, dest)
          return new Link(link.linkText || dest.emitAsTsdoc() || '',
            this.createLinkGetter(ref))
        } else {
          const url = String(link.urlDestination)
          return new Link(link.linkText || url, url)
        }
      }
      case DocNodeKind.CodeSpan: {
        const typed = node as DocCodeSpan
        return new FormattedSpan(typed.code, { code: true })
      }
      case DocNodeKind.FencedCode: {
        const typed = node as DocFencedCode
        let code = typed.code
        if (code[code.length - 1] === '\n') {
          code = code.substring(0, code.length - 1)
        }
        return new FormattedBlock(code, {
          type: BlockType.Code,
          subType: typed.language
        })
      }
      default:
        return new Span(node.kind)
    }
  }

  private parseDocNodes (item: ApiItem, nodes: readonly DocNode[]): Node[] {
    return trimNodes(nodes).map(
      (docItem) => this.parseDoc(item, docItem)
    )
  }

  private parseItemConcise (item: ApiItem, remarks = false): FormattedBlock {
    const block = new FormattedBlock()
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const comment = item.tsdocComment
      const children = this.parseDocNodes(item, comment.summarySection.nodes)
      if (remarks && comment.remarksBlock) {
        children.push(
          ...this.parseDocNodes(item, comment.remarksBlock.getChildNodes())
        )
      }
      block.append(...children)
    }
    return block
  }

  private parseItem (item: ApiItem, depth = 0): Document[] {
    const doc = new Document()
    const pkgName = (() => {
      const pkg = item.getAssociatedPackage()
      if (pkg) {
        return pkg.displayName
      }
      return 'unknown'
    })()
    const scopedName = item.getScopedNameWithinPackage()
    if (!scopedName) {
      doc.path = path.join(pkgName, 'index')
    } else {
      let name = scopedName.toLowerCase()
      if (name === 'index') {
        name = 'index_1'
      }
      doc.path = path.join(pkgName, name)
    }
    /* Breadcrumb */
    if (depth >= 0) {
      doc.append(this.generateBreadcrumb(item))
    }
    /* Heading */
    let heading
    switch (item.kind) {
      case ApiItemKind.ConstructSignature:
      case ApiItemKind.Constructor:
        heading = new Heading(`${scopedName}`, 2)
        break
      case ApiItemKind.Class:
        heading = new Heading(`${scopedName} class`, 2)
        break
      case ApiItemKind.Enum:
        heading = new Heading(`${scopedName} enum`, 2)
        break
      case ApiItemKind.Interface:
        heading = new Heading(`${scopedName} interface`, 2)
        break
      case ApiItemKind.Method:
      case ApiItemKind.MethodSignature:
        heading = new Heading(`${scopedName} method`, 2)
        break
      case ApiItemKind.Function:
        heading = new Heading(`${scopedName} function`, 2)
        break
      case ApiItemKind.Namespace:
        heading = new Heading(`${scopedName} namespace`, 2)
        break
      case ApiItemKind.Package: {
        const pkg = item as ApiPackage
        heading = new Heading(`${pkg.displayName} package`, 1)
        break
      }
      case ApiItemKind.Property:
      case ApiItemKind.PropertySignature:
        heading = new Heading(`${scopedName} property`, 2)
        break
      case ApiItemKind.TypeAlias:
        heading = new Heading(`${scopedName} type`, 2)
        break
      case ApiItemKind.Variable:
        heading = new Heading(`${scopedName} variable`, 2)
        break
      default:
        throw new Error('Unsupported ApiItem kind: ' + item.kind)
    }
    doc.append(heading)
    this.pHeadings.set(item, heading)
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const comment = item.tsdocComment
      if (comment.deprecatedBlock) {
        const block = comment.deprecatedBlock
        const children = trimNodes(block.getChildNodes()).map(
          (docItem) => this.parseDoc(item, docItem)
        )
        children.unshift(new FormattedSpan('Deprecated: ', {
          strong: true
        }))
        doc.append(new FormattedBlock(
          children, {
            type: BlockType.Error
          }
        ))
      }
      if (comment.modifierTagSet.isBeta() ||
        comment.modifierTagSet.isAlpha() ||
        comment.modifierTagSet.isExperimental()
      ) {
        comment.modifierTagSet.isPackageDocumentation()
        const children = [
          new FormattedSpan('Unstable: ', { strong: true })
        ]
        if (comment.modifierTagSet.isBeta()) {
          children.push(new FormattedSpan('beta', { code: true }))
        }
        if (comment.modifierTagSet.isAlpha()) {
          children.push(new FormattedSpan('alpha', { code: true }))
        }
        if (comment.modifierTagSet.isExperimental()) {
          children.push(new FormattedSpan('experimental', { code: true }))
        }
        doc.append(new FormattedBlock(
          children, {
            type: BlockType.Warning
          }
        ))
      }
      const children = trimNodes(comment.summarySection.nodes).map(
        (docItem) => this.parseDoc(item, docItem))
      doc.append(new FormattedBlock(children))
    }
    if (item instanceof ApiDeclaredItem) {
      let text = item.getExcerptWithModifiers()
      if (text[text.length - 1] === ';') {
        text = text.substring(0, text.length - 1)
      }
      doc.append(
        // new Heading('Syntax', 3),
        new FormattedBlock(text, {
          type: BlockType.Code,
          subType: 'typescript'
        })
      )
      const comment = item.tsdocComment
      if (ApiParameterListMixin.isBaseClassOf(item)) {
        doc.append(this.generateParamsTable(item as ApiParameterListMixin))
      } else if (comment && comment.params) {
        const block = new FormattedBlock()
        const memTables = new Table([ 'Parameter', 'Description' ])
        for (const param of comment.params) {
          const content = this.parseDocNodes(item, param.content.nodes)
          memTables.addRow([
            param.parameterName,
            new FormattedBlock(content)
          ])
        }
        block.append(
          new Heading('Parameters', 4),
          memTables)
        if (memTables.rows) {
          doc.append(block)
        }
      }
    }
    /* Table */
    switch (item.kind) {
      case ApiItemKind.ConstructSignature:
      case ApiItemKind.Constructor:
        break
      case ApiItemKind.Class: {
        doc.append(this.generateClassTable(item as ApiClass))
        break
      }
      case ApiItemKind.Enum: {
        doc.append(this.generateEnumTable(item as ApiEnum))
        break
      }
      case ApiItemKind.Interface: {
        doc.append(this.generateClassTable(item as ApiInterface))
        break
      }
      case ApiItemKind.Method:
      case ApiItemKind.MethodSignature:
      case ApiItemKind.Function: {
        break
      }
      case ApiItemKind.Namespace: {
        doc.append(this.generateNamespaceTable(item as ApiNamespace))
        break
      }
      case ApiItemKind.Package: {
        doc.append(this.generateNamespaceTable(item as ApiPackage))
        break
      }
      case ApiItemKind.Property:
      case ApiItemKind.PropertySignature:
      case ApiItemKind.TypeAlias:
      case ApiItemKind.Variable:
        break
      default: {
        throw new Error('Unsupported ApiItem kind: ' + item.kind)
      }
    }
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const comment = item.tsdocComment
      if (comment.returnsBlock) {
        const block = comment.returnsBlock
        const children = trimNodes(block.content.getChildNodes()).map(
          (docItem) => this.parseDoc(item, docItem)
        )
        children.unshift(new Heading('Return value', 4))
        doc.append(new FormattedBlock(
          children
        ))
      }
      if (comment.remarksBlock) {
        const block = comment.remarksBlock
        const children = trimNodes(block.content.getChildNodes()).map(
          (docItem) => this.parseDoc(item, docItem)
        )
        children.unshift(new Heading('Remarks', 3))
        doc.append(new FormattedBlock(
          children
        ))
      }
    }
    // switch (item.kind) {
    //   case ApiItemKind.Class:
    //   case ApiItemKind.Enum:
    //   case ApiItemKind.Interface:
    //   case ApiItemKind.Method:
    //   case ApiItemKind.MethodSignature:
    //   case ApiItemKind.Function:
    //   case ApiItemKind.Namespace:
    //   case ApiItemKind.Package:
    //   case ApiItemKind.Property:
    //   case ApiItemKind.PropertySignature:
    //   case ApiItemKind.TypeAlias:
    //   case ApiItemKind.Variable: {
    //     break
    //   }
    //   default: {
    //     throw new Error('Unsupported ApiItem kind: ' + item.kind)
    //   }
    // }
    let docs = [ doc ]
    switch (item.kind) {
      case ApiItemKind.Enum:
        return docs
      case ApiItemKind.ConstructSignature:
      case ApiItemKind.Constructor:
      case ApiItemKind.Class:
      case ApiItemKind.Interface:
      case ApiItemKind.Method:
      case ApiItemKind.MethodSignature:
      case ApiItemKind.Function:
      case ApiItemKind.Namespace:
      case ApiItemKind.Package:
      case ApiItemKind.Property:
      case ApiItemKind.PropertySignature:
      case ApiItemKind.TypeAlias:
      case ApiItemKind.Variable: {
        break
      }
      default: {
        throw new Error('Unsupported ApiItem kind: ' + item.kind)
      }
    }
    for (const mem of this.getMembers(item)) {
      const memDoc = this.parseItem(mem, depth - 1)
      if (depth > 0) {
        docs = docs.concat(memDoc)
      } else {
        doc.append(...memDoc)
      }
    }
    return docs
  }

  private generateBreadcrumb (item: ApiItem): Node {
    const block = new FormattedBlock([], { type: BlockType.Blockquote })
    let first = true
    const add = (text: string, link?: () => string): void => {
      if (first) {
        first = false
      } else {
        block.append(new Span(' / '))
      }
      if (link) {
        block.append(new Link(text, link))
      } else {
        block.append(new Span(text))
      }
    }
    for (const hi of item.getHierarchy()) {
      switch (hi.kind) {
        case ApiItemKind.Model:
        case ApiItemKind.EntryPoint:
          break
        case ApiItemKind.Package: {
          let name = hi.displayName
          const fms = name.split('/', 2)
          if (fms.length === 1) {
            add(name, this.createLinkGetter(hi))
          } else {
            add(fms[0])
            add(fms[1], this.createLinkGetter(hi))
          }
          break
        }
        default: {
          add(
            hi.displayName,
            this.createLinkGetter(hi)
          )
          break
        }
      }
    }
    return block
  }

  private generateClassTable (item: ApiClass | ApiInterface): Node {
    const block = new FormattedBlock()
    const constructors: Node[] = []
    const propsTable = new Table([ 'Property', 'Type', 'Description' ])
    const methodsTable = new Table([ 'Method', 'Description' ])
    for (const mem of item.members) {
      switch (mem.kind) {
        case ApiItemKind.Constructor:
        case ApiItemKind.ConstructSignature: {
          const typed = mem as ApiConstructor | ApiConstructSignature
          const params = typed.parameters.map(param =>
            `${param.name}: ${param.parameterTypeExcerpt.text}`
          ).join(', ')
          constructors.push(new ListItem([
            new Link(
              [ new FormattedSpan(`constructor(${params})`, { code: true }) ],
              this.createLinkGetter(mem))
          ]))
          break
        }
        case ApiItemKind.PropertySignature:
        case ApiItemKind.Property: {
          const typed = mem as ApiProperty | ApiPropertySignature & { isStatic?: unknown }
          const nameField = new FormattedBlock([
            new Link(
              [ new FormattedSpan(typed.name, { code: true }) ],
              this.createLinkGetter(mem))
          ])
          if (typed.isStatic) {
            nameField.append(
              new FormattedSpan('static', { code: true })
            )
          }
          if (typed.isEventProperty) {
            nameField.append(
              new FormattedSpan('event', { code: true })
            )
          }
          const cells: (string | Node)[] = [
            nameField,
            new FormattedSpan(typed.propertyTypeExcerpt.text, { code: true }),
            this.parseItemConcise(typed)
          ]
          propsTable.addRow(cells)
          break
        }
        case ApiItemKind.MethodSignature:
        case ApiItemKind.Method: {
          const typed = mem as ApiMethod | ApiMethodSignature & { isStatic?: unknown }
          const nameField = new FormattedBlock([
            new Link(
              [ new FormattedSpan(typed.name + '()', { code: true }) ],
              this.createLinkGetter(mem))
          ])
          if (typed.isStatic) {
            nameField.append(
              new FormattedSpan('static', { code: true })
            )
          }
          const cells: (string | Node)[] = [
            nameField,
            this.parseItemConcise(typed)
          ]
          methodsTable.addRow(cells)
          break
        }
      }
    }
    if (constructors.length) {
      block.append(
        new Heading('Constructors', 3),
        new List(constructors, true))
    }
    if (propsTable.rows) {
      block.append(
        new Heading('Properties', 3),
        propsTable)
    }
    if (methodsTable.rows) {
      block.append(
        new Heading('Methods', 3),
        methodsTable)
    }
    return block
  }

  private generateEnumTable (item: ApiEnum): Node {
    const block = new FormattedBlock()
    const memTables = new Table([ 'Member', 'Value', 'Description' ])
    for (const mem of item.members) {
      const cells: (string | Node)[] = [
        new FormattedSpan(mem.displayName, { code: true }),
        new FormattedSpan(mem.initializerExcerpt.text, { code: true }),
        this.parseItemConcise(mem, true)
      ]
      memTables.addRow(cells)
    }
    block.append(memTables)
    return block
  }

  private generateParamsTable (item: ApiParameterListMixin): Node {
    const block = new FormattedBlock()
    const memTables = new Table([ 'Parameter', 'Type', 'Description' ])
    for (const mem of item.parameters) {
      const cells: (string | Node)[] = [
        new FormattedSpan(mem.name, { code: true }),
        new FormattedSpan(mem.parameterTypeExcerpt.text, { code: true })
      ]
      if (mem.tsdocParamBlock) {
        const docBlock = mem.tsdocParamBlock
        const block = new FormattedBlock(
          this.parseDocNodes(item, docBlock.content.nodes)
        )
        cells.push(block)
      }
      memTables.addRow(cells)
    }
    if (memTables.rows) {
      block.append(
        new Heading('Parameters', 4),
        memTables
      )
    }
    return block
  }

  private generateNamespaceTable (container: ApiPackage | ApiNamespace): Node {
    const block = new FormattedBlock()
    const classes = new Table([ 'Class', 'Description' ])
    const enums = new Table([ 'Enumeration', 'Description' ])
    const functions = new Table([ 'Function', 'Description' ])
    const interfaces = new Table([ 'Interface', 'Description' ])
    const namespaces = new Table([ 'Namespace', 'Description' ])
    const vars = new Table([ 'Variable', 'Description' ])
    const types = new Table([ 'Type Alias', 'Description' ])
    for (const mem of this.getMembers(container)) {
      const row = new TableRow([
        new Link(
          [ new FormattedSpan(
            ApiParameterListMixin.isBaseClassOf(mem)
              ? mem.displayName + '()'
              : mem.displayName,
            { code: true })
          ],
          this.createLinkGetter(mem)),
        this.parseItemConcise(mem)
      ])
      switch (mem.kind) {
        case ApiItemKind.Class:
          classes.append(row)
          break
        case ApiItemKind.Enum:
          enums.append(row)
          break
        case ApiItemKind.Interface:
          interfaces.append(row)
          break
        case ApiItemKind.Method:
        case ApiItemKind.MethodSignature:
        case ApiItemKind.Function:
          functions.append(row)
          break
        case ApiItemKind.Namespace:
        case ApiItemKind.Package:
          namespaces.append(row)
          break
        case ApiItemKind.Property:
        case ApiItemKind.PropertySignature:
        case ApiItemKind.Variable: {
          vars.append(row)
          break
        }
        case ApiItemKind.TypeAlias:
          types.append(row)
          break
        default:
          break
      }
    }
    const level = 3
    if (classes.rows) {
      block.append(
        new Heading('Classes', level),
        classes)
    }
    if (enums.rows) {
      block.append(
        new Heading('Enumerations', level),
        enums)
    }
    if (functions.rows) {
      block.append(
        new Heading('Functions', level),
        functions)
    }
    if (interfaces.rows) {
      block.append(
        new Heading('Interfaces', level),
        interfaces)
    }
    if (namespaces.rows) {
      block.append(
        new Heading('Namespaces', level),
        namespaces)
    }
    if (vars.rows) {
      block.append(
        new Heading('Variables', level),
        vars)
    }
    if (types.rows) {
      block.append(
        new Heading('Type Aliases', level),
        types)
    }
    return block
  }

  public parse (depth = 0): Set<Document> {
    const results = new Set<Document>()
    for (const entry of this.model.members) {
      const docs = this.parseItem(entry, depth)
      for (const doc of docs) {
        results.add(doc)
      }
    }
    return results
  }
}
