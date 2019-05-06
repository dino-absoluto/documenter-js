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
import { Block } from './node'

/* code */
/**
 * Set alignment of column.
 */
enum TableColumnAlignment {
  Auto,
  Left,
  Center,
  Right
}

/**
 * A table cell.
 */
export class TableCell extends Block {
  public get kind (): string {
    return 'TABLE_CELL'
  }
}

/**
 * A table row.
 */
export class TableRow extends Block {
  public get kind (): string {
    return 'TABLE_ROW'
  }
}

/**
 * A table header row.
 */
export class TableHeader extends TableRow {
  public align: TableColumnAlignment[]
  public constructor (
    children: TableCell[],
    align: TableColumnAlignment[] = []
  ) {
    super(children)
    this.align = align
  }
  public get kind (): string {
    return 'TABLE_HEADER'
  }
}

/**
 * A table.
 */
export class Table extends Block {
  public constructor (header: TableHeader, rows: TableRow[] = []) {
    super(([ header ] as TableRow[]).concat(rows))
  }
  public get kind (): string {
    return 'TABLE'
  }
}
