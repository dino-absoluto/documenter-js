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
import { Node, Text, Span, Block } from '../node'

describe('Node', () => {
  class TNode extends Node {
    public beforeAdd (): void {
    }
  }
  test('simple', () => {
    const node = new TNode()
    const n1 = new TNode()
    const n2 = new TNode()
    expect(node.kind).toBe('NODE')
    node.beforeAdd = jest.fn(node.beforeAdd)
    node.append(n1)
    expect(n1.parent).toBe(node)
    expect(node.first).toBe(n1)
    expect(node.last).toBe(n1)
    expect(node.beforeAdd).toBeCalledTimes(1)
    node.prepend(n1)
    n1.before(n2)
    expect(node.first).toBe(n2)
    expect(node.last).toBe(n1)
    expect(n1.previous).toBe(n2)
    expect(n2.next).toBe(n1)
    expect(n1.next).toBe(undefined)
    expect(n2.previous).toBe(undefined)
    n1.after(n2)
    n1.replaceWith(n2)
    n2.remove()
    n2.before(n1)
    n2.after(n1)
    n2.replaceWith(n1)
    expect(node.children.length).toBe(0)
    expect(node.beforeAdd).toBeCalledTimes(5)
  })
})

describe('Text', () => {
  test('simple', () => {
    const node = new Text('ABC')
    const n1 = new Text('ABC')
    expect(node.kind).toBe('TEXT')
    expect(() => node.append(n1)).toThrow()
    expect(() => node.prepend(n1)).toThrow()
  })
})

describe('Span', () => {
  test('simple', () => {
    const node = new Span()
    expect(node.kind).toBe('SPAN')
  })
})

describe('Block', () => {
  class TBlock extends Block {
  }
  test('simple', () => {
    const node = new TBlock()
    expect(node.kind).toBe('BLOCK')
    expect(node.isParagraph).toBe(false)
  })
})
