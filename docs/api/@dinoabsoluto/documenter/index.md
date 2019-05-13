---
title: API
---
> @dinoabsoluto / [documenter](index)

# @dinoabsoluto/documenter package

See [simple](../../simple) for a preview.

### Interfaces

Interface                            | Description                                 |
-------------------------------------|---------------------------------------------|
[`Options`](index#options-interface) | Describe options for `generateDocuments()`. |

### Variables

Variable                                                | Description                                |
--------------------------------------------------------|--------------------------------------------|
[`generateDocuments`](index#generatedocuments-variable) | Generate documents from `.api.json` files. |

## Options interface

**Unstable:** `beta`

Describe options for `generateDocuments()`.

```typescript
export interface Options 
```

### Properties

Property                                 | Type     | Description                                     |
-----------------------------------------|----------|-------------------------------------------------|
[`depth`](index#optionsdepth-property)   | `number` | Set the maximum depth of breadcrumb navigation. |
[`outDir`](index#optionsoutdir-property) | `string` | Output directory, files within maybe deleted.   |

## Options.depth property

Set the maximum depth of breadcrumb navigation.

```typescript
depth?: number
```

## Options.outDir property

Output directory, files within maybe deleted.

```typescript
outDir: string
```

## generateDocuments variable

**Unstable:** `beta`

Generate documents from `.api.json` files.

```typescript
generateDocuments: (modelFiles: string[], options: Options) => Promise<void>
```

#### Parameters

Parameter  | Description                 |
-----------|-----------------------------|
modelFiles | Array of `.api.json` files. |
options    | Generation options.         |

#### Return value

 Return a promise which resolve to `undefined` on completion.
