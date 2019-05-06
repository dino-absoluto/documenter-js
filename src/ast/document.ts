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
import { Node, Block, ParentPointer } from './node'
import { Heading } from './heading'
import toId from '../utils/to-id'

function * traverse (node: Node): IterableIterator<Node> {
  yield node
  if (node instanceof Block) {
    for (const cnode of node.children) {
      yield * traverse(cnode)
    }
  }
}

/* code */
/**
 * A document.
 */
export class Document extends Block {
  private pPath?: string

  public get kind (): string {
    return 'DOCUMENT'
  }

  public get parent (): Document | undefined {
    return super.parent as Document
  }

  public get parentPointer (): ParentPointer | undefined {
    return super.parentPointer
  }

  public set parentPointer (loc: ParentPointer | undefined) {
    if (loc) {
      if (!(loc.parent instanceof Document)) {
        throw new Error('Document can only be added to other Document')
      }
    }
    super.parentPointer = loc
  }

  public get path (): string | undefined {
    if (this.parent) {
      return this.parent.path
    }
    return this.pPath
  }

  public set path (path: string | undefined) {
    path = path || undefined
    this.pPath = path
  }

  public generateIDs (idCount: { [id: string]: number } = {}): void {
    const { pPath: fpath } = this
    if (fpath === undefined) {
      for (const node of traverse(this)) {
        if (node !== this && node instanceof Document) {
          node.generateIDs(idCount)
        } else if (node instanceof Heading) {
          node.link = undefined
        }
      }
    } else {
      for (const node of traverse(this)) {
        if (node !== this && node instanceof Document) {
          node.generateIDs(idCount)
        } else if (node instanceof Heading) {
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
}
