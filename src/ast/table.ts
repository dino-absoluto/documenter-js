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
import { Block, Span, ParentPointer } from './node'

/* code */
/**
 * Set alignment of column.
 */
const enum TableColumnAlignment {
  Left = 1,
  Center = 2,
  Right = 3
}

let initCells: (children: (TableCell | string)[]) => TableCell[]

/**
 * A table row.
 */
export class TableRow extends Block {
  public get kind (): string {
    return 'TABLE_ROW'
  }
  public constructor (children: (TableCell | string)[]) {
    super(initCells(children))
  }
}

/**
 * A table cell.
 */
export class TableCell extends Block {
  public get kind (): string {
    return 'TABLE_CELL'
  }
  public get parent (): TableRow | undefined {
    return super.parent as TableRow
  }

  public get parentPointer (): ParentPointer | undefined {
    return super.parentPointer
  }

  public set parentPointer (loc: ParentPointer | undefined) {
    if (loc) {
      if (!(loc.parent instanceof TableRow)) {
        throw new Error('Document can only be added to other Document')
      }
    }
    super.parentPointer = loc
  }
}

initCells = (children: (TableCell | string)[]): TableCell[] => {
  return children.map(cell => {
    if (cell instanceof TableCell) {
      return cell
    } else {
      return new TableCell([
        new Span(cell)
      ])
    }
  })
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
    children: (TableCell | string)[],
    aligns: TableColumnAlignment[] = []
  ) {
    super(children)
    this.aligns = aligns
  }
}

const initHeader = (header: TableHeader | string[]): TableHeader => {
  if (header instanceof TableHeader) {
    return header
  } else {
    return new TableHeader(header)
  }
}

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
}
