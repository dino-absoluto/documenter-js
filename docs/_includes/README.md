
> Generate documents for typescript projects.

[![Build Status](https://travis-ci.com/dino-absoluto/documenter-js.svg?branch=master)](https://travis-ci.com/dino-absoluto/documenter-js)


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
