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
  ChildNode,
  ParentNode
} from '../node'
/* code */

class CNode extends ChildNode {
  public id: unknown
  public constructor (id: unknown) {
    super()
    this.id = id
  }
}

class PNode extends ParentNode {
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
      { location: { index: 0 }, id: 'a' },
      { location: { index: 1 }, id: 'b' }
    ])
    p.append(
      new CNode('c'),
      new CNode('d'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'a' },
      { location: { index: 1 }, id: 'b' },
      { location: { index: 2 }, id: 'c' },
      { location: { index: 3 }, id: 'd' }
    ])
  })
  test('prepend', () => {
    const p = new PNode('parent')
    p.prepend(new CNode('d'))
    p.prepend(new CNode('c'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'c' },
      { location: { index: 1 }, id: 'd' }
    ])
    p.prepend(
      new CNode('a'),
      new CNode('b'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'a' },
      { location: { index: 1 }, id: 'b' },
      { location: { index: 2 }, id: 'c' },
      { location: { index: 3 }, id: 'd' }
    ])
  })
})

describe('ChildNode', () => {
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
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'b' },
      { location: { index: 3 }, id: 'c' },
      { location: { index: 4 }, id: 'd' }
    ])
  })
  test('remove', () => {
    {
      const remove = p.children[3]
      remove.remove()
      expect(remove.location).toBe(undefined)
    }
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'b' },
      { location: { index: 3 }, id: 'd' }
    ])
    p.children[3].remove()
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'b' }
    ])
    p.children[0].remove()
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'a' },
      { location: { index: 1 }, id: 'b' }
    ])
  })
  test('before', () => {
    p.children[0].before(new CNode('ss'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 's' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'b' },
      { location: { index: 4 }, id: 'c' },
      { location: { index: 5 }, id: 'd' }
    ])
    p.children[3].before(new CNode('a-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 's' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'a-' },
      { location: { index: 4 }, id: 'b' },
      { location: { index: 5 }, id: 'c' },
      { location: { index: 6 }, id: 'd' }
    ])
    p.children[6].before(new CNode('c-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 's' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'a-' },
      { location: { index: 4 }, id: 'b' },
      { location: { index: 5 }, id: 'c' },
      { location: { index: 6 }, id: 'c-' },
      { location: { index: 7 }, id: 'd' }
    ])
  })
  test('after', () => {
    p.children[0].after(new CNode('ss'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'ss' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'b' },
      { location: { index: 4 }, id: 'c' },
      { location: { index: 5 }, id: 'd' }
    ])
    p.children[3].after(new CNode('a-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'ss' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'b' },
      { location: { index: 4 }, id: 'a-' },
      { location: { index: 5 }, id: 'c' },
      { location: { index: 6 }, id: 'd' }
    ])
    p.children[6].after(new CNode('c-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 's' },
      { location: { index: 1 }, id: 'ss' },
      { location: { index: 2 }, id: 'a' },
      { location: { index: 3 }, id: 'b' },
      { location: { index: 4 }, id: 'a-' },
      { location: { index: 5 }, id: 'c' },
      { location: { index: 6 }, id: 'd' },
      { location: { index: 7 }, id: 'c-' }
    ])
  })
  test('replaceWith', () => {
    {
      const remove = p.children[0]
      remove.replaceWith(new CNode('ss'))
      expect(remove.location).toBe(undefined)
    }
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'b' },
      { location: { index: 3 }, id: 'c' },
      { location: { index: 4 }, id: 'd' }
    ])
    p.children[2].replaceWith(new CNode('a-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'a-' },
      { location: { index: 3 }, id: 'c' },
      { location: { index: 4 }, id: 'd' }
    ])
    p.children[2].replaceWith(new CNode('b'), new CNode('b-'))
    expect(p.children).toMatchObject([
      { location: { index: 0 }, id: 'ss' },
      { location: { index: 1 }, id: 'a' },
      { location: { index: 2 }, id: 'b' },
      { location: { index: 3 }, id: 'b-' },
      { location: { index: 4 }, id: 'c' },
      { location: { index: 5 }, id: 'd' }
    ])
  })
})
