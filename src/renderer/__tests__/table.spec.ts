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
import { PlainText } from '../plain-text'
import { Table } from '../table'
/* code */

describe('Table', () => {
  test('simple', () => {
    const tb = new Table(['name', 'description'])
    tb.addRows([
      new PlainText('a'),
      new PlainText('Describe a')
    ], [
      new PlainText('value'),
      new PlainText('Describe value')
    ], [
      new PlainText('b'),
      new PlainText('Describe b')
    ], [
    ])
    expect(tb.toString()).toBe(
      'name  | description\n' +
      '----- | --------------\n' +
      'a     | Describe a\n' +
      'value | Describe value\n' +
      'b     | Describe b\n'
    )
  })
})
