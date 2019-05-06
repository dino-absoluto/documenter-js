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

import {
  ApiModel,
  ApiItem,
  ApiDocumentedItem,
  ApiPackage,
  ApiDeclaredItem
} from '@microsoft/api-extractor-model'

import {
  Node,
  PlainText,
  SoftBreak,
  Section,
  Paragraph,
  Heading,
  Table,
  Link,
  DynamicText,
  CodeBlock
} from '../renderer'

import toId from '../utils/to-id'

export class HeadingAnchor extends Heading {
  public parent: Page
  public title: string = ''
  public constructor (page: Page) {
    super(2, new DynamicText(() => {
      return this.text
    }))
    this.parent = page
  }

  public get text (): string {
    return this.title
  }

  public get link (): string {
    return this.parent.filename + '#' + toId(this.text)
  }
}

export class Page {
  public parent?: Page
  public header: HeadingAnchor = new HeadingAnchor(this)
  public sections: Section[] = []
  public subPages: Page[] = []
  public references: Page[] = []
  private pFilename: string
  public constructor (filename: string) {
    this.pFilename = filename
  }

  public get filename (): string {
    if (this.parent) {
      return this.parent.filename
    } else {
      return this.pFilename
    }
  }

  public toString (): string {
    let text = ''
    if (this.header.title) {
      text += this.header.toString() + `<a href="${this.header.link}"/>\n`
    }
    text += this.sections.map(s => s.toString()).join('\n\n')
    if (this.subPages.length) {
      text += '\n\n' + this.subPages.map(s => s.toString()).join('\n\n')
    }
    return text
  }

  public flat (): void {
    for (const pg of this.references) {
      pg.parent = this
      pg.flat()
    }
    this.subPages.push(...this.references)
    this.references = []
  }
}

export class Parser {
  public readonly model = new ApiModel()
  public loadPackage (filename: string): void {
    this.model.loadPackage(filename)
  }

  public resolveDeclaration (
    item: ApiItem,
    ref: DocDeclarationReference
  ): ApiItem {
    const result = this.model.resolveDeclarationReference(ref, item)
    if (result.resolvedApiItem) {
      return result.resolvedApiItem
    } else {
      throw new Error(result.errorMessage)
    }
  }

  public parseDocNode (item: ApiItem, node: DocNode): Node {
    switch (node.kind) {
      case DocNodeKind.PlainText: {
        const typed = node as DocPlainText
        return new PlainText(typed.text)
      }
      case DocNodeKind.SoftBreak: {
        return new SoftBreak()
      }
      case DocNodeKind.Paragraph: {
        const children = node.getChildNodes().map((n) => this.parseDocNode(item, n))
        return new Paragraph(children)
      }
      case DocNodeKind.Section: {
        const children = node.getChildNodes().map((n) => this.parseDocNode(item, n))
        return new Section(children)
      }
      case DocNodeKind.Block: {
        const typed = node as DocBlock
        const children = typed.content.getChildNodes().map((n) => this.parseDocNode(item, n))
        const nodes = [
          new Heading(4, new PlainText(typed.blockTag.tagName.substr(1))),
          ...children
        ]
        return new Section(nodes)
      }
      case DocNodeKind.ParamCollection: {
        const typed = node as DocParamCollection
        const params = typed.blocks.map(block => {
          return [
            new PlainText(block.parameterName),
            this.parseDocNode(item, block.content)
          ]
        })
        if (params.length) {
          const rs = new Table([ 'Name', 'Description' ].map(s => new PlainText(s)))
          rs.addRows(...params)
          return new Section([
            new Heading(4, new PlainText('parameters')),
            rs
          ])
        } else {
          return new PlainText()
        }
      }
      case DocNodeKind.LinkTag: {
        const typed = node as DocLinkTag
        if (typed.codeDestination) {
          const dest = this.resolveDeclaration(item, typed.codeDestination)
          return new Link(
            new PlainText(typed.linkText || dest.displayName),
            new PlainText(dest.getScopedNameWithinPackage())
          )
        } else {
          return new PlainText()
        }
      }
      default: {
        return new PlainText(node.kind)
      }
    }
  }

  public parseItem (item: ApiItem): Page {
    const pkg = item.getAssociatedPackage()
    const pkgName = pkg && pkg.name
    const scopedName = item.getScopedNameWithinPackage()
    const page = new Page(
      (pkgName || '') + (scopedName ? '.' + scopedName : '') + '.md')
    const children: Node[] = []
    if (item instanceof ApiPackage) {
      page.header.title =
        pkgName + ' package'
      page.header.level = 1
    }
    if (scopedName) {
      page.header.title = scopedName + ' ' + item.kind.toLowerCase()
    }
    if (item instanceof ApiDeclaredItem) {
      children.push(new CodeBlock([
        new PlainText(item.getExcerptWithModifiers())
      ], 'typescript'))
    }
    if (item instanceof ApiDocumentedItem && item.tsdocComment) {
      const docComment = item.tsdocComment
      children.push(this.parseDocNode(item, docComment.summarySection))
      if (docComment.params) {
        children.push(this.parseDocNode(item, docComment.params))
      }
      if (docComment.returnsBlock) {
        children.push(this.parseDocNode(item, docComment.returnsBlock))
      }
      if (docComment.remarksBlock) {
        children.push(this.parseDocNode(item, docComment.remarksBlock))
      }
    }
    page.sections.push(new Section(children))
    for (const mem of item.members) {
      const memPage = this.parseItem(mem)
      page.references.push(memPage)
    }
    return page
  }

  public parse (): void {
    const pages = []
    for (const entry of this.model.members) {
      const page = this.parseItem(entry)
      pages.push(page)
    }
    for (const pg of pages) {
      pg.flat()
    }
    console.log(
      '------\n' +
      pages.map(p => p.toString()).join('\n\n---\n\n') +
      '\n------'
    )
  }
}
