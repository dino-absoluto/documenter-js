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
import {
  ApiModel,
  ApiItem,
  ApiDocumentedItem
} from '@microsoft/api-extractor-model'
import { format } from 'util'
import render from './renderer'
import * as c from 'kleur'
/* code */

const traverse = (item: ApiItem, depth = 0): void => {
  let text = format(
    depth,
    item.kind, item.displayName,
    item.getScopedNameWithinPackage()
  )
  if (item instanceof ApiDocumentedItem && item.tsdocComment) {
    const docComment = item.tsdocComment
    let rtext = ''
    text += '\n---render\n'
    rtext = format(
      render(docComment.summarySection).toString()
    )
    if (docComment.remarksBlock) {
      rtext += render(docComment.remarksBlock).toString()
    }
    if (docComment.params) {
      rtext += render(docComment.params).toString()
    }
    text += c.green(rtext) + '\n---render-end'
  }
  console.log(text)
  for (const mem of item.members) {
    traverse(mem, depth + 1)
  }
}

export const documenter = (modelFile: string): void => {
  const model = new ApiModel()
  const pkg = model.loadPackage(modelFile)
  for (const entry of pkg.members) {
    traverse(entry)
  }
}
