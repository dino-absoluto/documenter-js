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
/**
 * This is a test package.
 *
 * ```typescript
 * class Hello {
 *   public count: number = 0 + 1
 *   public text?: string = 'hello world!'
 * }
 * ```
 *
 * @packageDocumentation
 */
/* imports */
import { Hello } from './hello'

export { Hello }
export { printMessage } from './hello'

/**
 * See {@link Hello.print}.
 * @public
 */
export const PI_CONSTANT = 3.14

/**
 * Text alignment.
 *
 * @remarks
 * Actual value is a string.
 *
 * @public
 */
export const enum Align {
  /**
   * Align left.
   */
  left = 'left',
  /**
   * Align center.
   */
  center = 'center',
  /**
   * Align right.
   */
  right = 'right'
}

/**
 * @public
 */
export type ABC = string
/**
 * @public
 */
export type Int = number

let n = 0

/**
 * @public
 */
export function count (): number {
  return n++
}

/**
 * A single point.
 * @public
 */
export interface Point {
  /**
   * x coordinate.
   */
  x: number
  /**
   * y coordinate.
   */
  y: number
}

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace test {
  export const defaultValue = 1
  export const recall = (): number => 0
  /** @internal */
  export const internalValue = 1
}
