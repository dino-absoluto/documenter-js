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
import documenter from '../src'
import { execFile as execFileCB } from 'child_process'
import { promisify } from 'util'
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
  const modelFiles = await globby(
    path.resolve(__dirname, '../__tmp__/docModel/*.api.json')
  )
  const outputDir = path.resolve(__dirname, '../docs/api')
  await documenter(modelFiles, outputDir)
})()
