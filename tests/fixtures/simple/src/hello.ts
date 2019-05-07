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

/* code */
/**
 * Describe a Hello object.
 *
 * @remarks
 * Doesn't do much except printing to console.
 *
 * @public
 */
export class Hello {
  private zero = 0
  /**
   * Number one.
   */
  public one: number = 1
  /**
   * Print a message.
   *
   * @param i - print this number
   * @returns void
   */
  public print (i: number): void {
    console.log('Hello World!', i + '!')
  }

  public sayHello (i?: number, ...texts: string[]): void {
    console.log(i, texts)
  }
}

/**
 * Print a welcome message.
 * @beta
 */
export const printMessage = (): void => {
  console.log('Welcome!')
}
