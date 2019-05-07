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
import * as Tree from '../tree/tree'

/* reexports */
export { ParentPointer } from '../tree/tree'

/* code */
/**
 * A basic node.
 */
export abstract class Node extends Tree.Node {
  public get kind (): string {
    return 'NODE'
  }
}

/**
 * A text span node.
 */
export class Span extends Node {
  public get kind (): string {
    return 'SPAN'
  }

  public text: string
  public constructor (text: string) {
    super()
    this.text = text
  }
}

/**
 * A text block node.
 */
export abstract class Block extends Node implements Tree.ParentNode {
  public get kind (): string {
    return 'BLOCK'
  }

  public children: Readonly<Tree.NodeArray<Node>> = new Tree.NodeArray(this)
  public constructor (children: Node[] | string = []) {
    super()
    this.children.push(...(
      typeof children === 'string'
        ? [ new Span(children) ]
        : Array.from(children)
    ))
  }

  public get isParagraph (): boolean {
    return false
  }

  public append (...nodes: Node[]): void {
    this.children.push(...nodes)
  }

  public prepend (...nodes: Node[]): void {
    this.children.unshift(...nodes)
  }
}
