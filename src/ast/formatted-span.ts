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
export interface FormattedSpanAttributes {
  strong?: boolean
  em?: boolean
  code?: boolean
}
/**
 * A formatted text span.
 */
export class FormattedSpan extends Span implements FormattedSpanAttributes {
  public get kind (): string {
    return 'FORMATTED_SPAN'
  }

  public strong: boolean = false
  public em: boolean = false
  public code: boolean = false
  public constructor (text: string, opts: FormattedSpanAttributes = {}) {
    super(text)
    if (opts.strong !== undefined) {
      this.strong = opts.strong
    }
    if (opts.em !== undefined) {
      this.em = opts.em
    }
  }
}
