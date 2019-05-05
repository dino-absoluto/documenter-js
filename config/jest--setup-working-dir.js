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
/* eslint-env jest */
/* imports */
const makeDir = require('make-dir')
const path = require('path')
const del = require('del')

const ROOTDIR = path.resolve(__dirname, '..')
const TMPDIR = path.join(ROOTDIR, '__tmp__/tests')

beforeAll(async () => {
  const testPath = path.resolve(global.jasmine.testPath)
  const relative = path.relative(ROOTDIR, testPath)
    .replace(/\/__tests__\//g, '/')
  const tmpDir = path.join(TMPDIR, relative)
  await makeDir(tmpDir)
  process.chdir(tmpDir)
  await del(path.join(tmpDir, '**/*'))
})
