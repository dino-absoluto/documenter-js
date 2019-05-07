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
  Document,
  Heading,
  FormattedBlock,
  FormattedSpan,
  BlockType,
  Span
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
        let text = typed.children.map((i) => this.renderNode(i)).join('')
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
        let text = typed.children.map((i) => this.renderNode(i)).join('\n\n')
        return text
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
