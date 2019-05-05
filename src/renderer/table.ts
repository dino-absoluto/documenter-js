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
import { Node } from './node'

/* code */
/**
 * Describe a document
 */
export class Table extends Node {
  private data: Node[][] = []
  private columns: string[] = []
  public constructor (columns: string[] = []) {
    super()
    this.columns = columns
  }

  public addRows (...items: Node[][]): void {
    this.data.push(...items)
  }

  public toString (): string {
    const { columns, data } = this
    const widths = columns.map(i => i.length)
    let rows = data.map(array => array.map(i => i.toString()))
    for (const row of rows) {
      for (const [index, field] of row.entries()) {
        widths[index] = Math.max(widths[index], field.length)
      }
    }
    rows = rows.map(row =>
      row.map((field, index) =>
        field.padEnd(widths[index], ' ')
      )
    )
    const titles = columns.map((title, index) =>
      title.padEnd(widths[index], ' ')
    )
    const lines = []
    const sep = ' | '
    lines.push(titles.join(sep).trim())
    lines.push(titles.map(i => '-'.repeat(i.length)).join(sep).trim())
    lines.push(...rows.map(row => row.join(sep).trim()))
    return lines.join('\n')
  }
}
