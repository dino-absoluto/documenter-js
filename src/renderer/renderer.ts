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
  Node,
  Block,
  Document,
  Heading,
  FormattedBlock,
  FormattedSpan,
  BlockType,
  Span,
  Link,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  TableColumnAlignment
} from '../ast'

/* code */
/**
 * The renderer.
 */
export class Renderer {
  public docs: Set<Document>
  public constructor (docs: Set<Document>) {
    this.docs = docs
  }

  public renderBlock (nodes: Readonly<Node[]>): string {
    let blocks: string[] = []
    let lastSpan: string | undefined
    for (const node of nodes) {
      if (node instanceof Block && node.isParagraph) {
        if (lastSpan) {
          blocks.push(lastSpan)
        }
        lastSpan = undefined
        blocks.push(this.renderNode(node))
      } else {
        lastSpan = (lastSpan || '') + this.renderNode(node)
      }
    }
    if (lastSpan) {
      blocks.push(lastSpan)
    }
    return blocks.join('\n\n')
  }

  public renderNode (node: Node): string {
    switch (node.kind) {
      case 'SPAN': {
        const typed = node as Span
        return typed.text
      }
      case 'FORMATTED_SPAN': {
        const typed = node as FormattedSpan
        let text = typed.text
        if (typed.code) {
          text = '`' + text + '`'
        }
        if (typed.strong) {
          text = '**' + text + '**'
        }
        if (typed.em) {
          text = '*' + text + '*'
        }
        return text
      }
      case 'LINE_BREAK':
        return '\n'
      case 'FORMATTED_BLOCK': {
        const typed = node as FormattedBlock
        let text = this.renderBlock(typed.children)
        switch (typed.type) {
          case BlockType.Info:
          case BlockType.Warning:
          case BlockType.Error:
          case BlockType.Default:
            break
          case BlockType.Blockquote:
            text = text.split('\n').map(line => '> ' + line).join('\n')
            break
          case BlockType.Code:
            text = '```' + typed.subType + '\n' + text + '\n```'
            break
          default:
            throw new Error('Unsupported FormattedBlock type: ' + typed.type)
        }
        return text
      }
      case 'HEADING': {
        const typed = node as Heading
        return '#'.repeat(typed.level) + ' ' +
          typed.text.replace(/\n/g, '<br>')
      }
      case 'DOCUMENT': {
        const typed = node as Document
        let text = this.renderBlock(typed.children)
        return text
      }
      case 'LINK': {
        const typed = node as Link
        return `[${typed.text}](${typed.href.toString()})`
      }
      case 'TABLE_CELL': {
        const typed = node as TableCell
        let text = this.renderBlock(typed.children).trim()
        return text.replace(/\n/g, '<br>').replace(/\|/g, '\\|')
      }
      case 'TABLE_ROW': {
        const typed = node as TableRow
        return typed.children.map((cell) =>
          this.renderNode(cell)).join(' | ')
      }
      case 'TABLE_HEADER': {
        const typed = node as TableHeader
        let row1: string[] = []
        let row2: string[] = []
        for (const [index, cell] of typed.children.entries()) {
          const align = typed.aligns[index]
          const text = this.renderNode(cell)
          row1.push(text)
          switch (align) {
            case TableColumnAlignment.Left:
              row2.push(':' + '-'.repeat(Math.max(1, text.length - 1)))
              break
            case TableColumnAlignment.Right:
              row2.push('-'.repeat(Math.max(1, text.length - 1)) + ':')
              break
            case TableColumnAlignment.Center:
              row2.push(':' + '-'.repeat(Math.max(1, text.length - 2)) + ':')
              break
            default:
              row2.push('-'.repeat(text.length))
              break
          }
        }
        return row1.join(' | ') + '\n' + row2.join(' | ')
      }
      case 'TABLE': {
        const typed = node as Table
        return typed.children.map((cell) =>
          this.renderNode(cell)).join('\n')
      }
      default:
        throw new Error('Unsupported Node type: ' + node.kind)
    }
  }

  public render (): Map<string, string> {
    for (const doc of this.docs) {
      doc.generateIDs()
    }
    const result = new Map<string, string>()
    for (const doc of this.docs) {
      result.set(doc.path || '<< undefined >>', this.renderNode(doc))
    }
    return result
  }
}
