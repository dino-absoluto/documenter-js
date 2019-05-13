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
  Text,
  Span,
  Link,
  Table,
  TableHeader,
  TableCell,
  TableColumnAlignment,
  List,
  ListItem
} from '../ast'
import * as path from 'path'

/* code */

const getDoc = (node: Node): Document | undefined => {
  let root = node.parent
  while (root) {
    if (root.parent) {
      root = root.parent
    } else {
      if (root instanceof Document) {
        return root
      }
      return undefined
    }
  }
}
/**
 * The renderer.
 */
export class Renderer {
  public docs: Set<Document>
  public constructor (docs: Set<Document>) {
    this.docs = docs
  }

  public renderBlock (nodes: Iterable<Node>): string {
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

  public renderSpan (nodes: Iterable<Node>): string {
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
    return blocks.join('<br>')
  }

  public renderNode (node: Node, kind = node.kind): string {
    switch (kind) {
      case 'TEXT': {
        const typed = node as Text
        return typed.text
      }
      case 'SPAN': {
        const typed = node as Span
        let text = this.renderSpan(typed.children)
        return text
      }
      case 'FORMATTED_SPAN': {
        const typed = node as FormattedSpan
        let text = this.renderNode(typed, 'SPAN')
        const begin = (text.match(/^\s+/) || [''])[0]
        const end = (text.match(/\s+$/) || [''])[0]
        text = text.trim()
        if (typed.code) {
          text = '`' + text + '`'
        }
        if (typed.strong) {
          text = '**' + text + '**'
        }
        if (typed.em) {
          text = '*' + text + '*'
        }
        return begin + text + end
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
        let text = this.renderNode(typed, 'SPAN')
        let href = typed.href.toString()
        const root = getDoc(typed)
        if (root) {
          const file = root.path
          if (!file) {
            throw new Error('This document\'s path is not set.')
          }
          href = path.relative(path.dirname(file), href)
        }
        return `[${text}](${href})`
      }
      case 'TABLE_CELL': {
        const typed = node as TableCell
        let text = this.renderSpan(typed.children).trim()
        return text.replace(/\n/g, ' ').replace(/\|/g, '\\|')
      }
      case 'TABLE': {
        const typed = node as Table
        const columns: number[] = []
        const children = [...typed.children]
        const aligns = (children[0] as TableHeader).aligns
        const texts: string[][] = []
        for (const row of children) {
          const rowData = [...row.children].map(
            (cell, index) => {
              return index === 0
                ? (this.renderNode(cell) + ' ')
                : (' ' + this.renderNode(cell) + ' ')
            })
          for (const [index, cell] of rowData.entries()) {
            columns[index] = Math.max(columns[index] || 0, cell.length)
          }
          texts.push(rowData)
        }
        for (const row of texts) {
          for (const [i, width] of columns.entries()) {
            const align = aligns[i]
            if (align === TableColumnAlignment.Right) {
              row[i] = (row[i] || '').padStart(width, ' ')
            } else if (align === TableColumnAlignment.Center) {
              const cell = row[i] || ''
              const firstWidth =
                Math.floor((width - cell.length) / 2) + cell.length
              row[i] = cell.padStart(firstWidth, ' ').padEnd(width, ' ')
            } else {
              row[i] = (row[i] || '').padEnd(width, ' ')
            }
          }
        }
        texts.splice(1, 0, columns.map((width, index) => {
          const align = aligns[index]
          switch (align) {
            case TableColumnAlignment.Left:
              return ':' + '-'.repeat(Math.max(1, width - 1))
            case TableColumnAlignment.Right:
              return '-'.repeat(Math.max(1, width - 1)) + ':'
            case TableColumnAlignment.Center:
              return ':' + '-'.repeat(Math.max(1, width - 2)) + ':'
            default:
              return '-'.repeat(width)
          }
        }))
        return texts.map((row) => {
          return row.join('|') + '|'
        }).join('\n')
      }
      case 'LIST_ITEM': {
        const typed = node as ListItem
        let text = this.renderBlock(typed.children).trim()
        return text.replace(/\n\n/g, '<br>\n')
          .split('\n')
          .map(t => `  ${t}`)
          .join('\n')
      }
      case 'LIST': {
        let items = []
        const typed = node as List
        let count = 0
        for (const item of typed.children) {
          let text = this.renderBlock(item.children).trim()
          text = text
            .replace(/\n\n/g, '<br>\n')
            .replace(/\n/g, '\n  ')
          if (typed.numbered) {
            items.push(`${++count}. ` + text)
          } else {
            items.push('- ' + text)
          }
        }
        return items.join('\n')
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
      result.set(doc.path || '<< undefined >>', this.renderNode(doc) + '\n')
    }
    return result
  }
}
