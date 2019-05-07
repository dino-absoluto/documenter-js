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
  Table,
  TableHeader,
  TableRow,
  TableCell
} from '../table'
import { FormattedBlock } from '../formatted-block'

/* code */
describe('Table', () => {
  test('constructor', () => {
    const table = new Table(['Name', 'Description'])
    expect(table.children.length).toBe(1)
    expect(table.header instanceof TableHeader).toBe(true)
    expect(JSON.stringify(table.header.children)).toBe(JSON.stringify([
      { children: [ { text: 'Name' } ] },
      { children: [ { text: 'Description' } ] }
    ]))
  })
})

describe('TableRow', () => {
  test('parent', () => {
    const block = new FormattedBlock()
    const row = new TableRow(['Abc', 'Welcome!'])
    expect(() => block.append(row)).toThrow('TableRow')
  })
})

describe('TableCell', () => {
  test('parent', () => {
    const block = new FormattedBlock()
    const cell = new TableCell('Abc')
    expect(() => block.append(cell)).toThrow('TableCell')
  })
})
