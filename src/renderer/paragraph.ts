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
export class Paragraph extends Node {
  private data: Node[]
  public constructor (data: Node[] = []) {
    super()
    this.data = data
  }

  public toString (): string {
    return this.data.map(node => node.toString()).join('')
  }
}

export class Heading extends Node {
  private data: Node
  private level: number
  public constructor (level: number, data: Node) {
    super()
    level = Number.isInteger(level)
      ? Math.min(6, Math.max(0, level))
      : 6
    this.level = level
    this.data = data
  }

  public toString (): string {
    return '#'.repeat(this.level) + this.data.toString()
  }
}
