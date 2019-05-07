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
  ApiItem,
  ApiItemKind,
  ApiDeclaredItem,
  ApiDocumentedItem
} from '@microsoft/api-extractor-model'

import {
  DocNode,
  DocNodeKind,
  DocPlainText,
  DocSoftBreak
} from '@microsoft/tsdoc'

import {
  Node,
  Document,
  Heading,
  FormattedBlock,
  FormattedSpan,
  BlockType,
  Span,
  LineBreak
} from '../ast'

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

  private parseDoc (item: ApiItem, node: DocNode): Node {
    switch (node.kind) {
      case DocNodeKind.PlainText:
        const typed = node as DocPlainText
        return new Span(typed.text)
      case DocNodeKind.SoftBreak:
        return new LineBreak()
      default:
        return new Span(node.kind)
    }
  }

  private parseItem (item: ApiItem): Document {
    const doc = new Document()
    const scopedName = item.getScopedNameWithinPackage()
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
      case ApiItemKind.Package:
        const pkg = item as ApiPackage
        heading = new Heading(`${pkg.displayName} package`, 1)
        break
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
      }
      const nodes = trimNodes(comment.summarySection.nodes).map(
        (docItem) => this.parseDoc(item, docItem))
      doc.append(
        new FormattedBlock(nodes)
      )
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
    switch (item.kind) {
      case ApiItemKind.Class:
      case ApiItemKind.Enum:
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
    return doc
  }

  public parse (): Set<Document> {
    const docs = new Set<Document>()
    for (const entry of this.model.members) {
      const doc = this.parseItem(entry)
      console.log(doc)
      docs.add(doc)
    }
    return docs
  }
}
