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
import { generateDocuments } from '../src'
import { execFile as execFileCB } from 'child_process'
import { promisify } from 'util'
import {
  readFileSync,
  writeFileSync
} from 'fs'
import * as path from 'path'
import * as c from 'kleur'
import globby = require('globby')

const execFile = promisify(execFileCB)

;(async () => {
  const pkgDir = path.resolve(__dirname, '../examples/simple')
  console.log('Run api-extractor on ' + c.cyan('examples/simple'))
  {
    const data = await execFile('npm', ['run', 'compile:api'], {
      cwd: pkgDir
    })
    console.log(data.stdout)
    console.log(data.stderr)
  }
  console.log('Run api-extractor on ' + c.cyan('<current project>'))
  {
    const data = await execFile('npm', ['run', 'compile:api'], {
    })
    console.log(data.stdout)
    console.log(data.stderr)
  }
  /** generate from api */
  const modelFiles = await globby(
    path.resolve(__dirname, '../__tmp__/docModel/*.api.json')
  )
  const outDir = path.resolve(__dirname, '../docs/api')
  await generateDocuments(modelFiles, {
    outDir
  })
  /** copy REAMDE */
  {
    const data = readFileSync(path.resolve(__dirname, '../README.md')).toString('utf8')
    const text = data.substring(data.indexOf('\n') + 1)
    writeFileSync(path.resolve(__dirname, '../docs/_includes/README.md'), text)
  }
})().catch(err => {
  console.error(c.red(err))
})
