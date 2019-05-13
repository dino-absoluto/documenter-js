
> Generate documents for typescript projects.

![Travis CI](https://travis-ci.com/dino-absoluto/documenter-js.svg?branch=master)


## Install
```bash
npm i -D @dinoabsoluto/documenter
```

## Usage

```typescript
import { generateDocuments } from '@dinoabsoluto/documenter'

generateDocuments([
  'target.api.json'
], {
  outDir: `${__dirname}/docs`
})
```
