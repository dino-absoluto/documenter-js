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
  // TableHeader,
  TableRow,
  TableCell
} from '../table'
import { FormattedBlock } from '../formatted-block'

/* code */
describe('Table', () => {
  test('simple', () => {
    const table = new Table(['Name', 'Description'])
    expect(table.first).not.toBe(undefined)
    const n = new FormattedBlock()
    expect(() => table.append(n)).toThrow('Table')
  })
})

describe('TableRow', () => {
  test('parent', () => {
    const block = new FormattedBlock()
    const row = new TableRow(['Abc', 'Welcome!'])
    expect(() => block.append(row)).toThrow('TableRow')
    expect(() => row.append(block)).toThrow('TableRow')
  })
})

describe('TableCell', () => {
  test('parent', () => {
    const block = new FormattedBlock()
    const cell = new TableCell('Abc')
    expect(() => block.append(cell)).toThrow('TableCell')
  })
})
