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
interface Location {
  index: number
  parent: ParentNode
}

export interface ChildNode {
  location?: Location
  index?: number
  parent?: ParentNode
  remove (): void
  before (...nodes: Node[]): void
  after (...nodes: Node[]): void
  replaceWith (...nodes: Node[]): void
}

export interface ParentNode {
  children: Node[]
  refreshIndex (start?: number, end?: number): void
  append (...nodes: Node[]): void
  prepend (...nodes: Node[]): void
}

export class Node implements ChildNode {
  public location?: Location = undefined
  private getLocation (): Location {
    if (!this.location) {
      throw new Error('This node does not belong to any ParentNode.')
    }
    return this.location
  }

  public get index (): number | undefined {
    if (this.location) {
      return this.location.index
    }
    return undefined
  }

  public get parent (): ParentNode | undefined {
    if (this.location) {
      return this.location.parent
    }
    return undefined
  }

  public remove (): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index, 1)
    parent.refreshIndex(index)
    this.location = undefined
  }

  public before (...nodes: Node[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index, 0, ...nodes)
    parent.refreshIndex(index)
  }

  public after (...nodes: Node[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index + 1, 0, ...nodes)
    parent.refreshIndex(index + 1)
  }

  public replaceWith (...nodes: Node[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index, 1, ...nodes)
    parent.refreshIndex(index)
    this.location = undefined
  }
}

export class Block extends Node implements ParentNode {
  public children: Node[] = []
  public constructor (children: Node[] = []) {
    super()
    this.children = Array.from(children)
    this.refreshIndex()
  }

  public append (...nodes: Node[]): void {
    for (const node of nodes) {
      node.location = {
        parent: this,
        index: this.children.length
      }
      this.children.push(node)
    }
  }

  public prepend (...nodes: Node[]): void {
    for (const [index, node] of nodes.entries()) {
      node.location = {
        parent: this,
        index
      }
    }
    this.children.unshift(...nodes)
    this.refreshIndex(nodes.length)
  }

  public refreshIndex (begin = 0, end = this.children.length): void {
    const { children } = this
    for (let i = begin; i < end; ++i) {
      children[i].location = {
        parent: this,
        index: i
      }
    }
  }
}

export class Span extends Node {
  public text: string
  public constructor (text: string) {
    super()
    this.text = text
  }
}
