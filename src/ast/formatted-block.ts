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
import { Block, Node } from './node'

/* code */
export const enum BlockType {
  Default = 0,
  Info,
  Warning,
  Error,
  Code,
  Blockquote
}

export interface FormattedBlockAttribute {
  type?: BlockType
  subType?: string
}

/**
 * A formatted text span.
 */
export class FormattedBlock extends Block implements FormattedBlockAttribute {
  public get kind (): string {
    return 'FORMATTED_BLOCK'
  }

  public type: BlockType = BlockType.Default
  public constructor (children: Node[] | string, opts: FormattedBlockAttribute = {}) {
    super(children)
    if (opts.type !== undefined) {
      this.type = opts.type
    }
  }
}
