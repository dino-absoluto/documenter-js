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
    const header = new TableHeader([
      'Name', 'Description'
    ])
    const table = new Table(header)
    expect(table.header).toBe(header)
  })
  test('simple', () => {
    const table = new Table(['Name', 'Description'])
    const first = table.first as TableHeader
    expect(table.kind).toBe('TABLE')
    expect(table.isParagraph).toBe(true)
    expect(table.header).toBe(first)
    expect(first).not.toBe(undefined)
    expect(first.kind).toBe('TABLE_HEADER')
    expect(first.children.length).toBe(2)
    const n = new FormattedBlock()
    expect(() => table.append(n)).toThrow('Table')
    expect(table.rows).toBe(0)
    table.addRow(['n', 'integer'])
    expect(table.rows).toBe(1)
    table.addRow(['n', 'integer'])
    expect(table.rows).toBe(2)
    table.addRow(new TableRow([ 'Hello' ]))
    expect(table.rows).toBe(3)
    expect(() => first.remove()).toThrow('TableHeader')
  })
})

describe('TableRow', () => {
  test('constructor', () => {
    const n1 = new TableCell('Type')
    const n2 = new FormattedBlock()
    const row = new TableRow([
      'Name',
      n1,
      n2
    ])
    expect(row.children.length).toBe(3)
    const children = [...row.children]
    expect(children[1]).toBe(n1)
    expect(children[2].first).toBe(n2)
  })
  test('parent', () => {
    const block = new FormattedBlock()
    const row = new TableRow(['Abc', 'Welcome!'])
    expect(row.kind).toBe('TABLE_ROW')
    expect(() => block.append(row)).toThrow('TableRow')
    expect(() => row.append(block)).toThrow('TableRow')
  })
})

describe('TableCell', () => {
  test('parent', () => {
    const block = new FormattedBlock()
    const cell = new TableCell('Abc')
    expect(cell.kind).toBe('TABLE_CELL')
    expect(() => block.append(cell)).toThrow('TableCell')
  })
})
