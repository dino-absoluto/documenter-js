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
  DocNodeKind,
  DocNode,
  DocPlainText,
  DocBlock,
  DocParamCollection
} from '@microsoft/tsdoc'

/* code */
export const render = (node: DocNode): string => {
  switch (node.kind) {
    case DocNodeKind.PlainText: {
      const typed = node as DocPlainText
      return typed.text
    }
    case DocNodeKind.SoftBreak: {
      return '\n'
    }
    case DocNodeKind.Paragraph:
    case DocNodeKind.Section: {
      return node.getChildNodes().map(render).join('')
    }
    case DocNodeKind.Block: {
      const typed = node as DocBlock
      return `## ${typed.blockTag.tagName}\n${render(typed.content)}`
    }
    case DocNodeKind.ParamCollection: {
      const typed = node as DocParamCollection
      const params = typed.blocks.map(block => {
        return `${
          block.parameterName
        } ${
          render(block.content)
        }`
      })
      return params.join('')
    }
    default: {
      return node.kind
    }
  }
}

export default render
