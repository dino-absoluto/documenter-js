/*
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
import { Linear as Tree, Children, ChildNode, ParentNode } from '@dinoabsoluto/tree'

/* code */
/**
 * A basic node.
 */
export abstract class Node implements ChildNode, ParentNode {
  public get kind (): string {
    return 'NODE'
  }

  /* child data */

  protected beforeAdd (_newNodes: Node[]): void {
  }

  public get parent (): Node | undefined {
    return Tree.parent(this)
  }

  public get children (): Children<Node> {
    return Tree.children(this)
  }

  public get first (): Node | undefined {
    return Tree.first(this)
  }

  public get last (): Node | undefined {
    return Tree.last(this)
  }

  public get next (): Node | undefined {
    return Tree.next(this)
  }

  public get previous (): Node | undefined {
    return Tree.previous(this)
  }

  public remove (): void {
    Tree.remove(this)
  }

  public before (...nodes: Node[]): void {
    this.beforeAdd(nodes)
    Tree.before(this, ...nodes)
  }

  public after (...nodes: Node[]): void {
    this.beforeAdd(nodes)
    Tree.after(this, ...nodes)
  }

  public replaceWith (...nodes: Node[]): void {
    this.beforeAdd(nodes)
    Tree.replaceWith(this, ...nodes)
  }

  public append (...nodes: Node[]): void {
    this.beforeAdd(nodes)
    Tree.append(this, ...nodes)
  }

  public prepend (...nodes: Node[]): void {
    this.beforeAdd(nodes)
    Tree.prepend(this, ...nodes)
  }
}

/**
 * A text plain text spain.
 */
export class Text extends Node {
  public get kind (): string {
    return 'TEXT'
  }

  public text: string
  public constructor (text: string) {
    super()
    this.text = text
  }

  protected beforeAdd (): never {
    throw new Error('Span cannot have children.')
  }
}

/**
 * A text span.
 */
export class Span extends Node {
  public get kind (): string {
    return 'SPAN'
  }

  public constructor (children: Node[] | string = []) {
    super()
    this.append(...(
      typeof children === 'string'
        ? [ new Text(children) ]
        : Array.from(children)
    ))
  }
}

/**
 * A text block node.
 */
export abstract class Block extends Node {
  public get kind (): string {
    return 'BLOCK'
  }

  public constructor (children: Node[] | string = []) {
    super()
    this.append(...(
      typeof children === 'string'
        ? [ new Text(children) ]
        : Array.from(children)
    ))
  }

  public get isParagraph (): boolean {
    return false
  }
}
