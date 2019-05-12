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
import { Parser } from './parser'
import { Renderer } from './renderer'
// import * as c from 'kleur'
import * as fs from 'fs'
import * as path from 'path'
import makeDir = require('make-dir')
/* code */

export const documenter =
async (modelFiles: string[], outDir: string): Promise<void> => {
  const parser = new Parser()
  for (const file of modelFiles) {
    parser.loadPackage(file)
  }
  const renderer = new Renderer(parser.parse(1))
  await makeDir(outDir)
  const savedCWD = process.cwd()
  try {
    process.chdir(outDir)
    for (const [fpath, content] of renderer.render()) {
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
