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
import { Node, Block } from './node'
import { Heading } from './heading'
import toId from '../utils/to-id'
/* code */

export class Document extends Block {
  private pPath?: string
  private static * traverse (node: Node): IterableIterator<Node> {
    yield node
    if (node instanceof Block) {
      for (const cnode of node.children) {
        yield * Document.traverse(cnode)
      }
    }
  }

  public get path (): string | undefined {
    return this.pPath
  }

  public setPath (fpath?: string): void {
    this.pPath = fpath
    this.generateIDs()
  }

  public generateIDs (): void {
    const { pPath: fpath } = this
    const idCount: { [id: string]: number } = {}
    if (fpath === undefined) {
      for (const node of Document.traverse(this)) {
        if (node instanceof Heading) {
          node.link = undefined
        }
      }
      return
    }
    for (const node of Document.traverse(this)) {
      if (node instanceof Heading) {
        const id = toId(node.text)
        let count = 0
        if (idCount[id] === undefined) {
          idCount[id] = 1
        } else {
          count = idCount[id]++
        }
        node.link = `${fpath}#${toId(node.text)}` +
          (count > 0 ? ('-' + count) : '')
      }
    }
  }
}
