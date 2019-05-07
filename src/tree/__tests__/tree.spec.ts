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
  NodeArray,
  ParentNode
} from '../tree'
/* code */

class CNode extends Node {
  public id: unknown
  public constructor (id: unknown) {
    super()
    this.id = id
  }
}

class PNode extends Node implements ParentNode {
  public id: unknown
  public readonly children: NodeArray = new NodeArray(this)
  public constructor (id: unknown) {
    super()
    this.id = id
  }
  public append (...nodes: Node[]): void {
    this.children.push(...nodes)
  }
  public prepend (...nodes: Node[]): void {
    this.children.unshift(...nodes)
  }
}

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const generateIDs = (texts: string[]) => {
  return expect.objectContaining(texts.map(
    (id, index) => ({ index, id })
  ).map(expect.objectContaining))
}

describe('ParentNode', () => {
  test('append', () => {
    const p = new PNode('parent')
    p.append(new CNode('a'))
    p.append(new CNode('b'))
    expect(p.children).toMatchObject(generateIDs([
      'a',
      'b'
    ]))
    p.append(
      new CNode('c'),
      new CNode('d'))
    expect(p.children).toMatchObject(generateIDs([
      'a',
      'b',
      'c',
      'd'
    ]))
  })
  test('prepend', () => {
    const p = new PNode('parent')
    p.prepend(new CNode('d'))
    p.prepend(new CNode('c'))
    expect(p.children).toMatchObject(generateIDs([
      'c',
      'd'
    ]))
    p.prepend(
      new CNode('a'),
      new CNode('b'))
    expect(p.children).toMatchObject(generateIDs([
      'a',
      'b',
      'c',
      'd'
    ]))
  })
  test('switch parent', () => {
    const p1 = new PNode('parent1')
    const p2 = new PNode('parent2')
    const n1 = new CNode('a')
    const n2 = new CNode('b')
    const n3 = new CNode('c')
    p1.append(n1, n2, n3)
    expect(p1.children).toMatchObject(generateIDs([
      'a',
      'b',
      'c'
    ]))
    p2.append(n2)
    expect(p2.children).toMatchObject(generateIDs([
      'b'
    ]))
    expect(p1.children).toMatchObject(generateIDs([
      'a',
      'c'
    ]))
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
    expect(p.children).toMatchObject(generateIDs([
      's',
      'a',
      'b',
      'c',
      'd'
    ]))
  })
  test('remove', () => {
    {
      const remove = p.children[3]
      remove.remove()
      expect(remove.parent).toBe(undefined)
    }
    expect(p.children).toMatchObject(generateIDs([
      's',
      'a',
      'b',
      'd'
    ]))
    p.children[3].remove()
    expect(p.children).toMatchObject(generateIDs([
      's',
      'a',
      'b'
    ]))
    p.children[0].remove()
    expect(p.children).toMatchObject(generateIDs([
      'a',
      'b'
    ]))
  })
  test('before', () => {
    p.children[0].before(new CNode('ss'))
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      's',
      'a',
      'b',
      'c',
      'd'
    ]))
    p.children[3].before(new CNode('a-'))
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      's',
      'a',
      'a-',
      'b',
      'c',
      'd'
    ]))
    p.children[6].before(new CNode('c-'))
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      's',
      'a',
      'a-',
      'b',
      'c',
      'c-',
      'd'
    ]))
  })
  test('after', () => {
    p.children[0].after(new CNode('ss'))
    expect(p.children).toMatchObject(generateIDs([
      's',
      'ss',
      'a',
      'b',
      'c',
      'd'
    ]))
    p.children[3].after(new CNode('a-'))
    expect(p.children).toMatchObject(generateIDs([
      's',
      'ss',
      'a',
      'b',
      'a-',
      'c',
      'd'
    ]))
    p.children[6].after(new CNode('c-'))
    expect(p.children).toMatchObject(generateIDs([
      's',
      'ss',
      'a',
      'b',
      'a-',
      'c',
      'd',
      'c-'
    ]))
  })
  test('replaceWith', () => {
    {
      const remove = p.children[0]
      remove.replaceWith(new CNode('ss'))
      expect(remove.parent).toBe(undefined)
    }
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      'a',
      'b',
      'c',
      'd'
    ]))
    p.children[2].replaceWith(new CNode('a-'))
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      'a',
      'a-',
      'c',
      'd'
    ]))
    p.children[2].replaceWith(new CNode('b'), new CNode('b-'))
    expect(p.children).toMatchObject(generateIDs([
      'ss',
      'a',
      'b',
      'b-',
      'c',
      'd'
    ]))
  })
})
