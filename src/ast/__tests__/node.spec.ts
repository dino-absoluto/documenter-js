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
  Block
} from '../node'
/* code */

class CNode extends Node {
  public id: unknown
  public constructor (id: unknown) {
    super()
    this.id = id
  }
}

class PNode extends Block {
  public id: unknown
  public constructor (id: unknown) {
    super()
    this.id = id
  }
}

describe('ParentNode', () => {
  test('append', () => {
    const p = new PNode('parent')
    p.append(new CNode('a'))
    p.append(new CNode('b'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'b' }
    ].map(expect.objectContaining))
    p.append(
      new CNode('c'),
      new CNode('d'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'b' },
      { index: 2, id: 'c' },
      { index: 3, id: 'd' }
    ].map(expect.objectContaining))
  })
  test('prepend', () => {
    const p = new PNode('parent')
    p.prepend(new CNode('d'))
    p.prepend(new CNode('c'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'c' },
      { index: 1, id: 'd' }
    ].map(expect.objectContaining))
    p.prepend(
      new CNode('a'),
      new CNode('b'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'b' },
      { index: 2, id: 'c' },
      { index: 3, id: 'd' }
    ].map(expect.objectContaining))
  })
  test('switch parent', () => {
    const p1 = new PNode('parent1')
    const p2 = new PNode('parent2')
    const n1 = new CNode('a')
    const n2 = new CNode('b')
    const n3 = new CNode('c')
    p1.append(n1, n2, n3)
    expect(p1.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'b' },
      { index: 2, id: 'c' }
    ].map(expect.objectContaining))
    p2.append(n2)
    expect(p2.children).toMatchObject([
      { index: 0, id: 'b' }
    ].map(expect.objectContaining))
    expect(p1.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'c' }
    ].map(expect.objectContaining))
  })
})

describe('Node', () => {
  let p: PNode
  beforeEach(() => {
    p = new PNode('parent')
    p.append(...[
      's',
      'a',
      'b',
      'c',
      'd'
    ].map(i => new CNode(i)))
  })
  test('init', () => {
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'a' },
      { index: 2, id: 'b' },
      { index: 3, id: 'c' },
      { index: 4, id: 'd' }
    ].map(expect.objectContaining))
  })
  test('remove', () => {
    {
      const remove = p.children[3]
      remove.remove()
      expect(remove.parentPointer).toBe(undefined)
    }
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'a' },
      { index: 2, id: 'b' },
      { index: 3, id: 'd' }
    ].map(expect.objectContaining))
    p.children[3].remove()
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'a' },
      { index: 2, id: 'b' }
    ].map(expect.objectContaining))
    p.children[0].remove()
    expect(p.children).toMatchObject([
      { index: 0, id: 'a' },
      { index: 1, id: 'b' }
    ].map(expect.objectContaining))
  })
  test('before', () => {
    p.children[0].before(new CNode('ss'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 's' },
      { index: 2, id: 'a' },
      { index: 3, id: 'b' },
      { index: 4, id: 'c' },
      { index: 5, id: 'd' }
    ].map(expect.objectContaining))
    p.children[3].before(new CNode('a-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 's' },
      { index: 2, id: 'a' },
      { index: 3, id: 'a-' },
      { index: 4, id: 'b' },
      { index: 5, id: 'c' },
      { index: 6, id: 'd' }
    ].map(expect.objectContaining))
    p.children[6].before(new CNode('c-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 's' },
      { index: 2, id: 'a' },
      { index: 3, id: 'a-' },
      { index: 4, id: 'b' },
      { index: 5, id: 'c' },
      { index: 6, id: 'c-' },
      { index: 7, id: 'd' }
    ].map(expect.objectContaining))
  })
  test('after', () => {
    p.children[0].after(new CNode('ss'))
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'ss' },
      { index: 2, id: 'a' },
      { index: 3, id: 'b' },
      { index: 4, id: 'c' },
      { index: 5, id: 'd' }
    ].map(expect.objectContaining))
    p.children[3].after(new CNode('a-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'ss' },
      { index: 2, id: 'a' },
      { index: 3, id: 'b' },
      { index: 4, id: 'a-' },
      { index: 5, id: 'c' },
      { index: 6, id: 'd' }
    ].map(expect.objectContaining))
    p.children[6].after(new CNode('c-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 's' },
      { index: 1, id: 'ss' },
      { index: 2, id: 'a' },
      { index: 3, id: 'b' },
      { index: 4, id: 'a-' },
      { index: 5, id: 'c' },
      { index: 6, id: 'd' },
      { index: 7, id: 'c-' }
    ].map(expect.objectContaining))
  })
  test('replaceWith', () => {
    {
      const remove = p.children[0]
      remove.replaceWith(new CNode('ss'))
      expect(remove.parentPointer).toBe(undefined)
    }
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 'a' },
      { index: 2, id: 'b' },
      { index: 3, id: 'c' },
      { index: 4, id: 'd' }
    ].map(expect.objectContaining))
    p.children[2].replaceWith(new CNode('a-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 'a' },
      { index: 2, id: 'a-' },
      { index: 3, id: 'c' },
      { index: 4, id: 'd' }
    ].map(expect.objectContaining))
    p.children[2].replaceWith(new CNode('b'), new CNode('b-'))
    expect(p.children).toMatchObject([
      { index: 0, id: 'ss' },
      { index: 1, id: 'a' },
      { index: 2, id: 'b' },
      { index: 3, id: 'b-' },
      { index: 4, id: 'c' },
      { index: 5, id: 'd' }
    ].map(expect.objectContaining))
  })
})
