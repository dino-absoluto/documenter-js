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
import { Heading } from './heading'

interface RefHeading {
  kind: 'heading'
  ref: Heading
}

interface RefStatic {
  kind: 'static'
  ref: string
}

type RefCallbackFn = () => string
interface RefFn {
  kind: 'callback'
  ref: RefCallbackFn
}

type Ref = RefHeading | RefStatic | RefFn
type ReferenceInit = Heading | string | RefCallbackFn

/**
 * A reference.
 */
export class Reference {
  private ref: Ref
  public constructor (ref: ReferenceInit) {
    if (ref instanceof Heading) {
      this.ref = {
        kind: 'heading',
        ref: ref
      }
    } else if (typeof ref === 'string') {
      this.ref = {
        kind: 'static',
        ref: ref
      }
    } else if (typeof ref === 'function') {
      this.ref = {
        kind: 'callback',
        ref: ref
      }
    } else {
      throw new Error('Unrecognized reference')
    }
  }

  public toString (): string {
    const { ref } = this
    switch (ref.kind) {
      case 'heading': {
        if (ref.ref.link) {
          return ref.ref.link
        }
        break
      }
      case 'static': {
        return ref.ref
      }
      case 'callback': {
        const url = ref.ref()
        if (typeof url === 'string') {
          return url
        }
        break
      }
      default: break
    }
    throw new Error('Cannot resolve reference.')
  }
}

/* code */
/**
 * A link.
 */
export class Link extends Span {
  public href: Reference
  public constructor (text: string, href: ReferenceInit) {
    super(text)
    this.href = new Reference(href)
  }

  public get kind (): string {
    return 'LINK'
  }
}

/**
 * An image.
 */
export class Image extends Span {
  public href: Reference
  public constructor (text: string, href: ReferenceInit) {
    super(text)
    this.href = new Reference(href)
  }

  public get kind (): string {
    return 'IMAGE'
  }
}
