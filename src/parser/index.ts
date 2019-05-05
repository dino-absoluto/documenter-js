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
  DocParamCollection,
  DocLinkTag,
  DocDeclarationReference
} from '@microsoft/tsdoc'
import { ApiModel, ApiItem } from '@microsoft/api-extractor-model'

import {
  Node,
  PlainText,
  SoftBreak,
  Section,
  Paragraph,
  Heading,
  Table
} from '../renderer'

type Resolver = (ref: DocDeclarationReference) => string | undefined

/* code */
export const render = (model: ApiModel, item: ApiItem, node: DocNode): Node => {
  switch (node.kind) {
    case DocNodeKind.PlainText: {
      const typed = node as DocPlainText
      return new PlainText(typed.text)
    }
    case DocNodeKind.SoftBreak: {
      return new SoftBreak()
    }
    case DocNodeKind.Paragraph: {
      const children = node.getChildNodes().map((n) => render(model, item, n))
      return new Paragraph(children)
    }
    case DocNodeKind.Section: {
      const children = node.getChildNodes().map((n) => render(model, item, n))
      return new Section(children)
    }
    case DocNodeKind.Block: {
      const typed = node as DocBlock
      const children = typed.content.getChildNodes().map((n) => render(model, item, n))
      const nodes = [
        new Heading(2, new PlainText(typed.blockTag.tagName)),
        ...children
      ]
      return new Section(nodes)
    }
    case DocNodeKind.ParamCollection: {
      const typed = node as DocParamCollection
      const params = typed.blocks.map(block => {
        return [
          block.parameterName,
          render(model, item, block.content)
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
    case DocNodeKind.LinkTag: {
      const typed = node as DocLinkTag
      if (typed.codeDestination) {
        const dest = typed.codeDestination
        const link = model.resolveDeclarationReference(dest, item)
        if (link.resolvedApiItem) {
          console.log(link.resolvedApiItem.getScopedNameWithinPackage())
        }
      }
      return 'undefined'
      // return new Link(typed.linkText, typed.codeDestination)
    }
    default: {
      return new PlainText(node.kind)
    }
  }
}

export default render
