---
{
  "title": "API"
}
---
> @dinoabsoluto / [documenter](index)

# @dinoabsoluto/documenter package

See [simple](../../simple) for a preview.

### Functions

Function                                                  | Description                                |
----------------------------------------------------------|--------------------------------------------|
[`generateDocuments()`](index#generatedocuments-function) | Generate documents from `.api.json` files. |

### Interfaces

Interface                            | Description                                 |
-------------------------------------|---------------------------------------------|
[`Options`](index#options-interface) | Describe options for `generateDocuments()`. |

## generateDocuments() function

**Unstable:** `beta`

Generate documents from `.api.json` files.

```typescript
export declare function generateDocuments(modelFiles: string[], options: Options): Promise<void>
```

#### Parameters

Parameter    | Type       | Description                 |
-------------|------------|-----------------------------|
`modelFiles` | `string[]` | Array of `.api.json` files. |
`options`    | `Options`  | Generation options.         |

#### Return value

 Return a promise which resolve to `undefined` on completion.

## Options interface

**Unstable:** `beta`

Describe options for `generateDocuments()`.

```typescript
export interface Options 
```

### Properties

Property                                           | Type                        | Description                                     |
---------------------------------------------------|-----------------------------|-------------------------------------------------|
[`depth`](index#optionsdepth-property)             | `number`                    | Set the maximum depth of breadcrumb navigation. |
[`extraFiles`](index#optionsextrafiles-property)   | `Map<string, string>`       | Extra files.                                    |
[`frontMatter`](index#optionsfrontmatter-property) | `(fpath: string) => object` | Front matter generator.                         |
[`outDir`](index#optionsoutdir-property)           | `string`                    | Output directory, files within maybe deleted.   |

## Options.depth property

Set the maximum depth of breadcrumb navigation.

```typescript
depth?: number
```

## Options.extraFiles property

Extra files.

```typescript
extraFiles?: Map<string, string>
```

## Options.frontMatter property

Front matter generator.

```typescript
frontMatter?: (fpath: string) => object
```

#### Parameters

Parameter | Description         |
----------|---------------------|
fpath     | Path of input file. |

#### Return value

 Return an `object` representing the front matter.

## Options.outDir property

Output directory, files within maybe deleted.

```typescript
outDir: string
```
