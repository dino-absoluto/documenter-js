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
/* imports */
import { Parser } from './parser'
import { Renderer } from './renderer'
// import * as c from 'kleur'
import * as fs from 'fs'
import * as path from 'path'
import del from 'del'
import makeDir = require('make-dir')
/* code */

/**
 * Describe options for generateDocuments().
 * @beta
 */
export interface Options {
  /**
   * Output directory, files within maybe deleted.
   */
  outDir: string
  /**
   * Set the maximum depth of breadcrumb navigation.
   */
  depth?: number
}

/**
 * Generate documents from `.api.json` files.
 * @param modelFiles - Array of `.api.json` files.
 * @param options - Generation options.
 * @returns
 * Return a promise which resolve to `undefined` on completion.
 * @beta
 */
export const generateDocuments =
async (modelFiles: string[], options: Options): Promise<void> => {
  const parser = new Parser()
  for (const file of modelFiles) {
    parser.loadPackage(file)
  }
  const renderer = new Renderer(parser.parse(options.depth || 0))
  const { outDir } = options
  await makeDir(outDir)
  const savedCWD = process.cwd()
  try {
    process.chdir(outDir)
    const rendered = renderer.render()
    const dirs = new Set<string>()
    for (const [fpath] of rendered) {
      const target = path.join(outDir, fpath + '.md')
      dirs.add(path.dirname(target))
    }
    for (const dir of dirs) {
      await del(dir)
    }
    for (const [fpath, content] of rendered) {
      const target = path.join(outDir, fpath + '.md')
      await makeDir(path.dirname(target))
      fs.writeFileSync(target,
        '---\ntitle: API\n---\n' +
        content
      )
    }
  } finally {
    process.chdir(savedCWD)
  }
}
