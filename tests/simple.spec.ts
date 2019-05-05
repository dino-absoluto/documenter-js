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
import * as path from 'path'
import { accessSync } from 'fs'
import { execFile as execFileCB } from 'child_process'
import { promisify } from 'util'

const execFile = promisify(execFileCB)
const dataDir = path.join(__dirname, 'fixtures/simple')
const docModelFile = path.join(dataDir, '__tmp__/docModel/simple.api.json')

beforeAll(async () => {
  try {
    accessSync(docModelFile)
    return
  } catch (err) {
  }
  let output = ''
  {
    const data = await execFile('npm', ['run', 'build:ts'], {
      cwd: dataDir
    })
    output += data.stdout
    output += data.stderr
  }
  {
    const data = await execFile('npm', ['run', 'build:api'], {
      cwd: dataDir
    })
    output += data.stdout
    output += data.stderr
  }
  console.log(output)
}, 20000)

/* code */
describe('simple', () => {
  test('simple', () => {
    console.log(path.resolve('.'))
  })
})
