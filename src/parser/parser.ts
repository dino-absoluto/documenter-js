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
  ApiMethod,
  ApiEnum,
  ApiInterface,
  ApiParameterListMixin
} from '@microsoft/api-extractor-model'

import {
  DocNode,
  DocNodeKind,
  DocPlainText,
  DocSoftBreak,
  DocLinkTag,
  DocDeclarationReference
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
  Table
} from '../ast'

/* code */

const trimNodes = (nodes: ReadonlyArray<DocNode>): DocNode[] => {
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
          return new Link(link.linkText || dest.emitAsTsdoc() || '', (): string => {
            const heading = this.pHeadings.get(ref)
            if (heading) {
              if (!heading.link) {
                throw new Error('Cannot resolve link: ' + dest.emitAsTsdoc())
              }
              return heading.link
            }
            return ''
          })
        } else {
          const url = String(link.urlDestination)
          return new Link(link.linkText || url, url)
        }
      }
      default:
        return new Span(node.kind)
    }
  }

  private parseItemConcise (item: ApiItem, remarks = false): FormattedBlock {
    const block = new FormattedBlock()
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const comment = item.tsdocComment
      const children = trimNodes(comment.summarySection.nodes).map(
        (docItem) => this.parseDoc(item, docItem))
      if (remarks && comment.remarksBlock) {
        children.push(
          ...trimNodes(comment.remarksBlock.getChildNodes()).map(
            (docItem) => this.parseDoc(item, docItem)
          )
        )
      }
      block.append(...children)
    }
    return block
  }

  private parseItem (item: ApiItem): Document {
    const doc = new Document()
    const pkgName = (() => {
      const pkg = item.getAssociatedPackage()
      if (pkg) {
        return pkg.displayName
      }
      return 'unknown'
    })()
    const scopedName = item.getScopedNameWithinPackage()
    doc.path = pkgName + '.md' +
      (scopedName ? ('#' + scopedName) : '')
    /* Heading */
    let heading
    switch (item.kind) {
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
        children.unshift(new FormattedSpan('Deprecated:', {
          strong: true
        }))
        doc.append(new FormattedBlock(
          children, {
            type: BlockType.Error
          }
        ))
      }
      const children = trimNodes(comment.summarySection.nodes).map(
        (docItem) => this.parseDoc(item, docItem))
      doc.append(new FormattedBlock(children))
    }
    if (item instanceof ApiDeclaredItem) {
      doc.append(
        new FormattedBlock([ new FormattedSpan('Signature:', { strong: true }) ]),
        new FormattedBlock(item.getExcerptWithModifiers(), {
          type: BlockType.Code,
          subType: 'typescript'
        })
      )
    }
    /* Table */
    switch (item.kind) {
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
        doc.append(this.generateParamsTable(item as ApiParameterListMixin))
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
      case ApiItemKind.Variable: {
        break
      }
      default: {
        throw new Error('Unsupported ApiItem kind: ' + item.kind)
      }
    }
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const comment = item.tsdocComment
      if (comment.remarksBlock) {
        const block = comment.remarksBlock
        const children = trimNodes(block.content.getChildNodes()).map(
          (docItem) => this.parseDoc(item, docItem)
        )
        children.unshift(new Heading('Remarks', 4))
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
    const members = (function * () {
      for (const mem of item.members) {
        if (mem.kind === ApiItemKind.EntryPoint) {
          yield * mem.members
        } else {
          yield mem
        }
      }
    })()
    for (const mem of members) {
      const memDoc = this.parseItem(mem)
      doc.append(memDoc)
    }
    return doc
  }

  private generateClassTable (item: ApiClass | ApiInterface): Node {
    const block = new FormattedBlock()
    const propsTable = new Table([ 'Property', 'Type', 'Description' ])
    const methodsTable = new Table([ 'Method', 'Description' ])
    for (const mem of item.members) {
      switch (mem.kind) {
        case ApiItemKind.Property: {
          const typed = mem as ApiProperty
          const nameField = new FormattedBlock(typed.name)
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
        case ApiItemKind.Method: {
          const typed = mem as ApiMethod
          const nameField = new FormattedBlock(
            typed.excerpt.text.replace(/;$/, ''))
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
    if (propsTable.hasRows) {
      block.append(
        new Heading('Properties', 4),
        propsTable)
    }
    if (methodsTable.hasRows) {
      block.append(
        new Heading('Methods', 4),
        methodsTable)
    }
    return block
  }

  private generateEnumTable (item: ApiEnum): Node {
    const block = new FormattedBlock()
    const memTables = new Table([ 'Member', 'Value', 'Description' ])
    for (const mem of item.members) {
      const cells: (string | Node)[] = [
        mem.displayName,
        mem.initializerExcerpt.text,
        this.parseItemConcise(mem, true)
      ]
      memTables.addRow(cells)
    }
    block.append(memTables)
    return block
  }

  private generateParamsTable (item: ApiParameterListMixin): Node {
    const block = new FormattedBlock()
    return block
  }

  private generateNamespaceTable (item: ApiPackage | ApiNamespace): Node {
    const block = new FormattedBlock()
    return block
  }

  public parse (): Set<Document> {
    const docs = new Set<Document>()
    for (const entry of this.model.members) {
      const doc = this.parseItem(entry)
      docs.add(doc)
    }
    return docs
  }
}
