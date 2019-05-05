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

import { Node } from './node'

import {
  PlainText,
  SoftBreak
} from './span'

import { Section } from './section'
import {
  Paragraph,
  Heading
} from './paragraph'

import { Table } from './table'

/* code */
export const render = (node: DocNode): Node => {
  switch (node.kind) {
    case DocNodeKind.PlainText: {
      const typed = node as DocPlainText
      return new PlainText(typed.text)
    }
    case DocNodeKind.SoftBreak: {
      return new SoftBreak()
    }
    case DocNodeKind.Paragraph: {
      return new Paragraph(node.getChildNodes().map(render))
    }
    case DocNodeKind.Section: {
      return new Section(node.getChildNodes().map(render))
    }
    case DocNodeKind.Block: {
      const typed = node as DocBlock
      const nodes = [
        new Heading(2, new PlainText(typed.blockTag.tagName)),
        ...typed.content.getChildNodes().map(render)
      ]
      return new Section(nodes)
    }
    case DocNodeKind.ParamCollection: {
      const typed = node as DocParamCollection
      const params = typed.blocks.map(block => {
        return [
          block.parameterName,
          render(block.content)
        ]
      })
      if (params.length) {
        const rs = new Table([ 'Name', 'Description' ])
        rs.addRows(...params)
        return rs
      } else {
        return new PlainText()
      }
    }
    default: {
      return new PlainText(node.kind)
    }
  }
}

export default render
