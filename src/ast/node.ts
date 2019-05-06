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
export class Node {
}

interface Location {
  index: number
  parent: ParentNode
}

export class ChildNode extends Node {
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

  public before (...nodes: ChildNode[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index, 0, ...nodes)
    parent.refreshIndex(index)
  }

  public after (...nodes: ChildNode[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index + 1, 0, ...nodes)
    parent.refreshIndex(index + 1)
  }

  public replaceWith (...nodes: ChildNode[]): void {
    const { parent, index } = this.getLocation()
    parent.children.splice(index, 1, ...nodes)
    parent.refreshIndex(index)
    this.location = undefined
  }
}

export class ParentNode extends ChildNode {
  public children: ChildNode[] = []
  public constructor (children: ChildNode[] = []) {
    super()
    this.children = children
  }

  public append (...nodes: ChildNode[]): void {
    for (const node of nodes) {
      node.location = {
        parent: this,
        index: this.children.length
      }
      this.children.push(node)
    }
  }

  public prepend (...nodes: ChildNode[]): void {
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
