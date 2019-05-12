
> Generate documents for typescript projects.

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
