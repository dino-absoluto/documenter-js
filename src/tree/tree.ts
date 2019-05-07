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
/**
 * Point to ParentNode.
 */
export interface ParentPointer {
  index: number
  parent: ParentNode
}

/**
 * Describe a child node.
 */
export interface ChildNode {
  setParent (parent?: ParentPointer): void
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
  children: ChildNode[]
  append (...nodes: ChildNode[]): void
  prepend (...nodes: ChildNode[]): void
}

/**
 * A child node.
 */
export class Node implements ChildNode {
  private pParentPointer?: ParentPointer = undefined
  public constructor () {
    Object.defineProperty(this, 'pParentPointer', {
      enumerable: false
    })
  }

  public get index (): number | undefined {
    if (this.pParentPointer) {
      return this.pParentPointer.index
    }
    return undefined
  }

  public get parent (): ParentNode | undefined {
    if (this.pParentPointer) {
      return this.pParentPointer.parent
    }
    return undefined
  }

  private getParent (): ParentPointer {
    if (!this.pParentPointer) {
      throw new Error('This node does not belong to any ParentNode.')
    }
    return this.pParentPointer
  }

  public setParent (loc?: ParentPointer): void {
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

  public remove (): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1)
  }

  public before (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 0, ...nodes)
  }

  public after (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index + 1, 0, ...nodes)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent, index } = this.getParent()
    parent.children.splice(index, 1, ...nodes)
  }
}

export class NodeArray<T extends ChildNode> extends Array<T> {
  private parent: ParentNode
  public constructor (parent: ParentNode) {
    super()
    this.parent = parent
  }

  private updateIndex (begin = 0, end = this.length): void {
    const { parent } = this
    for (let i = begin; i < end; ++i) {
      if (!this[i]) {
        continue
      }
      this[i].setParent({
        parent,
        index: i
      })
    }
  }

  public get length (): number {
    return super.length
  }

  public set length (newLength: number) {
    const length = this.length
    if (newLength >= 0 && newLength < length) {
      for (let i = newLength; i < length; ++i) {
        if (!this[i]) {
          continue
        }
        this[i].setParent(undefined)
      }
    }
    super.length = newLength
  }

  public push (...nodes: T[]): number {
    const lastLength = this.length
    const length = super.push(...nodes)
    this.updateIndex(lastLength)
    return length
  }

  public pop (): T | undefined {
    const node = super.pop()
    if (node) {
      node.setParent(undefined)
    }
    return node
  }

  public shift (): T | undefined {
    const node = super.shift()
    if (node) {
      node.setParent(undefined)
    }
    this.updateIndex()
    return node
  }

  public unshift (...nodes: T[]): number {
    const length = super.unshift(...nodes)
    this.updateIndex()
    return length
  }

  public sort (compareFn?: (a: T, b: T) => number): this {
    super.sort(compareFn)
    this.updateIndex()
    return this
  }

  public reverse (): this {
    super.reverse()
    this.updateIndex()
    return this
  }

  public splice (
    start: number,
    deleteCount?: number,
    ...nodes: T[]): T[] {
    const result = super.splice(start, deleteCount || 0, ...nodes)
    if (start < 0) {
      start = Math.max(0, this.length + start)
    }
    if (deleteCount === nodes.length) {
      this.updateIndex(start, start + deleteCount)
    } else {
      this.updateIndex(start)
    }
    for (const node of result) {
      node.setParent(undefined)
    }
    return result
  }
}
