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
import { Span } from './node'

/* code */
/**
 * A heading.
 */
export class Heading extends Span {
  private pLevel: number = 4
  public link?: string

  public constructor (text: string, level: number = 4) {
    super(text)
    this.level = level
  }

  public get kind (): string {
    return 'HEADING'
  }

  public get level (): number {
    return this.pLevel
  }

  public set level (value: number) {
    if (Number.isInteger(value)) {
      this.pLevel = Math.max(1, Math.min(6, value))
    } else {
      this.pLevel = 4
    }
  }
}
