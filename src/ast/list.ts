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

let LocalListItem: Function

export class List extends Block {
  public get kind (): string {
    return 'LIST'
  }

  public numbered: boolean
  public constructor (children: Node[] | string = [], numbered = false) {
    super(children)
    this.numbered = numbered
  }

  protected beforeAdd (newNodes: Node[]): void {
    for (const node of newNodes) {
      if (!(node instanceof LocalListItem)) {
        throw new Error('List only accept ListItem')
      }
    }
  }
}

export class ListItem extends Block {
  public get kind (): string {
    return 'LIST_ITEM'
  }

  protected [PARENT_CONSTRAINT] (newParent: Node): void {
    if (!(newParent instanceof List)) {
      throw new Error('ListItem can only be added to List.')
    }
  }
}

LocalListItem = ListItem
