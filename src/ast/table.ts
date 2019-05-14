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
import { PARENT_CONSTRAINT } from '@dinoabsoluto/tree'
import { Node, Block } from './node'

/* code */
/**
 * Set alignment of column.
 */
export const enum TableColumnAlignment {
  Left = 1,
  Center = 2,
  Right = 3
}

type TableCellData = TableCell | Node | string

let initCells: (children: TableCellData[]) => TableCell[]
let initHeader: (header: TableHeader | string[]) => TableHeader
let initRow: (row: TableRow | TableCellData[]) => TableRow

let LocalTableRow: Function
let LocalTableCell: Function

/**
 * A table.
 */
export class Table extends Block {
  public get kind (): string {
    return 'TABLE'
  }

  public constructor (header: TableHeader | string[], rows: TableRow[] = []) {
    super(
      ([] as TableRow[]).concat([ initHeader(header) ], rows)
    )
  }

  protected beforeAdd (newNodes: Node[]): void {
    for (const node of newNodes) {
      if (!(node instanceof LocalTableRow)) {
        throw new Error('Table only accept TableRow')
      }
    }
  }

  public get isParagraph (): boolean {
    return true
  }

  public get header (): TableHeader {
    return this.first as TableHeader
  }

  public addRow (...rows: (TableRow | TableCellData[])[]): void {
    this.append(...rows.map(initRow))
  }

  public get rows (): number {
    return this.children.length - 1
  }
}

/**
 * A table row.
 */
export class TableRow extends Block {
  public get kind (): string {
    return 'TABLE_ROW'
  }

  public constructor (children: TableCellData[]) {
    super(initCells(children))
  }

  protected beforeAdd (newNodes: Node[]): void {
    for (const node of newNodes) {
      if (!(node instanceof LocalTableCell)) {
        throw new Error('TableRow only accept TableCell')
      }
    }
  }

  protected [PARENT_CONSTRAINT] (newParent: Node): void {
    if (!(newParent instanceof Table)) {
      throw new Error('TableRow can only be added to Table.')
    }
  }
}

/**
 * A table cell.
 */
export class TableCell extends Block {
  public get kind (): string {
    return 'TABLE_CELL'
  }

  protected [PARENT_CONSTRAINT] (newParent: Node): void {
    if (!(newParent instanceof TableRow)) {
      throw new Error('TableCell can only be added to TableRow.')
    }
  }
}

/**
 * A table header row.
 */
export class TableHeader extends TableRow {
  public get kind (): string {
    return 'TABLE_HEADER'
  }

  public aligns: TableColumnAlignment[]
  public constructor (
    children: TableCellData[],
    aligns: TableColumnAlignment[] = []
  ) {
    super(children)
    this.aligns = aligns
  }

  public remove (): void {
    throw new Error('TableHeader cannot be removed.')
  }
}

initHeader = (header: TableHeader | TableCellData[]): TableHeader => {
  if (header instanceof TableHeader) {
    return header
  } else {
    return new TableHeader(header)
  }
}

initRow = (row: TableRow | TableCellData[]): TableRow => {
  if (row instanceof TableRow) {
    return row
  } else {
    return new TableRow(row)
  }
}

initCells = (children: (TableCellData)[]): TableCell[] => {
  return children.map(cell => {
    if (cell instanceof TableCell) {
      return cell
    } else if (cell instanceof Node) {
      return new TableCell([ cell ])
    } else {
      return new TableCell(cell)
    }
  })
}

LocalTableRow = TableRow
LocalTableCell = TableCell
