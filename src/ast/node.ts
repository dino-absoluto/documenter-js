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

/* code */
export interface ParentPointer {
  index: number
  parent: ParentNode
}

/**
 * Describe a child node.
 */
export interface ChildNode {
  parentPointer?: ParentPointer
  index?: number
  parent?: ParentNode
  remove (): void
  before (...nodes: Node[]): void
  after (...nodes: Node[]): void
  replaceWith (...nodes: Node[]): void
}

/**
 * Describe a parent node.
 */
export interface ParentNode {
  children: Node[]
  refreshIndex (start?: number, end?: number): void
  append (...nodes: Node[]): void
  prepend (...nodes: Node[]): void
}

/**
 * A basic node.
 */
export class Node implements ChildNode {
  public get kind (): string {
    return 'NODE'
  }

  private pParentPointer?: ParentPointer = undefined
  private getParent (): ParentPointer {
    if (!this.pParentPointer) {
      throw new Error('This node does not belong to any ParentNode.')
    }
    return this.pParentPointer
  }

  public get parentPointer (): ParentPointer | undefined {
    return this.pParentPointer
  }

  public set parentPointer (loc: ParentPointer | undefined) {
    const { pParentPointer } = this
    if (pParentPointer && loc) {
      if (loc.parent === pParentPointer.parent) {
        pParentPointer.index = loc.index
      } else {
        this.remove()
        this.pParentPointer = loc
      }
      return
    }
    this.pParentPointer = loc
  }

  public get index (): number | undefined {
    if (this.parentPointer) {
      return this.parentPointer.index
    }
    return undefined
  }

  public get parent (): ParentNode | undefined {
    if (this.parentPointer) {
      return this.parentPointer.parent
    }
    return undefined
  }

  public remove (): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1)
    parent.refreshIndex(index)
    this.parentPointer = undefined
  }

  public before (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 0, ...nodes)
    parent.refreshIndex(index)
  }

  public after (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index + 1, 0, ...nodes)
    parent.refreshIndex(index + 1)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1, ...nodes)
    parent.refreshIndex(index)
    this.parentPointer = undefined
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
export abstract class Block extends Node implements ParentNode {
  public get kind (): string {
    return 'BLOCK'
  }

  public children: Node[] = []
  public constructor (children: Node[] | string = []) {
    super()
    this.children = typeof children === 'string'
      ? [ new Span(children) ]
      : Array.from(children)
    this.refreshIndex()
  }

  public append (...nodes: Node[]): void {
    const lastIndex = this.children.length
    this.children.push(...nodes)
    this.refreshIndex(lastIndex)
  }

  public prepend (...nodes: Node[]): void {
    this.children.unshift(...nodes)
    this.refreshIndex()
  }

  public refreshIndex (begin = 0, end = this.children.length): void {
    const { children } = this
    for (let i = begin; i < end; ++i) {
      children[i].parentPointer = {
        parent: this,
        index: i
      }
    }
  }
}
