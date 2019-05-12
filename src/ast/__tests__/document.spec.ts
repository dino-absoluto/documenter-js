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
import { FormattedBlock } from '../formatted-block'
import { Document } from '../document'
import { Heading } from '../heading'

/* code */
describe('Document', () => {
  test('path', () => {
    const doc = new Document()
    const group = new FormattedBlock()
    const h1 = new Heading('example')
    const h2 = new Heading('example')
    const h3 = new Heading('Hello World!')
    doc.append(group)
    doc.append(h1)
    group.append(h2)
    doc.append(h3)
    expect(h1.link).toBe(undefined)
    expect(h2.link).toBe(undefined)
    expect(h3.link).toBe(undefined)
    doc.path = 'simple.md'
    doc.generateIDs()
    expect(h1.link).toBe('simple.md#example-1')
    expect(h2.link).toBe('simple.md#example')
    expect(h3.link).toBe('simple.md#hello-world')
    doc.path = ''
    doc.generateIDs()
    expect(h1.link).toBe(undefined)
    expect(h2.link).toBe(undefined)
    expect(h3.link).toBe(undefined)
  })
  test('path 2', () => {
    const doc1 = new Document()
    const doc2 = new Document()
    const h1 = new Heading('example')
    const h2 = new Heading('example')
    doc1.path = 'simple.md'
    doc1.append(h1)
    doc1.append(doc2)
    doc2.append(h2)
    doc1.generateIDs()
    expect(h1.link).toBe('simple.md#example')
    expect(h2.link).toBe('simple.md#example-1')
  })
  test('parent', () => {
    const doc = new Document()
    const doc1 = new Document()
    const group = new FormattedBlock()
    expect(() => group.append(doc1)).toThrow()
    doc.append(doc1)
    doc.path = 'simple.md'
    expect(doc1.path).toBe('simple.md')
    doc1.path = 'doc1.md'
    expect(doc1.path).toBe('simple.md')
  })
})
