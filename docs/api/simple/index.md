---
{
  "title": "API"
}
---
> [simple]()

# simple package

This is a test package.

```typescript
class Hello {
  public count: number = 0 + 1
  public text?: string = 'hello world!'
}
```



### Classes

Class                           | Description              |
--------------------------------|--------------------------|
[`Hello`](#hello-class)         | Describe a Hello object. |
[`TestClass`](#testclass-class) |                          |

### Enumerations

Enumeration            | Description     |
-----------------------|-----------------|
[`Align`](#align-enum) | Text alignment. |

### Functions

Function                     | Description |
-----------------------------|-------------|
[`count()`](#count-function) |             |

### Interfaces

Interface                   | Description     |
----------------------------|-----------------|
[`Point`](#point-interface) | A single point. |

### Namespaces

Namespace                 | Description |
--------------------------|-------------|
[`test`](#test-namespace) |             |

### Variables

Variable                                 | Description                            |
-----------------------------------------|----------------------------------------|
[`PI_CONSTANT`](#pi_constant-variable)   | See [Hello.print](#helloprint-method). |
[`printMessage`](#printmessage-variable) | Print a welcome message.               |

### Type Aliases

Type Alias         | Description |
-------------------|-------------|
[`ABC`](#abc-type) |             |
[`Int`](#int-type) |             |

## Align enum

Text alignment.

```typescript
export declare const enum Align 
```

Member   | Value      | Description   |
---------|------------|---------------|
`center` | `"center"` | Align center. |
`left`   | `"left"`   | Align left.   |
`right`  | `"right"`  | Align right.  |

### Remarks

Actual value is a string.

## count() function



```typescript
export declare function count(): number
```



## Hello class

Describe a Hello object.

```typescript
export declare class Hello 
```

### Properties

Property                    | Type     | Description |
----------------------------|----------|-------------|
[`one`](#helloone-property) | `number` | Number one. |

### Methods

Method                                | Description      |
--------------------------------------|------------------|
[`print()`](#helloprint-method)       | Print a message. |
[`sayHello()`](#hellosayhello-method) |                  |

### Remarks

Doesn't do much except printing to console.

The constructor for this class is marked as internal. Third-party code should not call the constructor directly or create subclasses that extend the `Hello` class.

## Hello.one property

Number one.

```typescript
one: number
```

## Hello.print() method

Print a message.

```typescript
print(i: number): void
```

#### Parameters

Parameter | Type     | Description       |
----------|----------|-------------------|
`i`       | `number` | print this number |

#### Return value

 Doesn't return anything.

## Hello.sayHello() method

```typescript
sayHello(i?: number, ...texts: string[]): void
```

#### Parameters

Parameter | Type       | Description |
----------|------------|-------------|
`i`       | `number`   |             |
`texts`   | `string[]` |             |

## Point interface

A single point.

```typescript
export interface Point 
```

### Properties

Property                | Type     | Description   |
------------------------|----------|---------------|
[`x`](#pointx-property) | `number` | x coordinate. |
[`y`](#pointy-property) | `number` | y coordinate. |

## Point.x property

x coordinate.

```typescript
x: number
```

## Point.y property

y coordinate.

```typescript
y: number
```

## test namespace



```typescript
export declare namespace test 
```

### Variables

Variable                                     | Description |
---------------------------------------------|-------------|
[`defaultValue`](#testdefaultvalue-variable) |             |
[`recall`](#testrecall-variable)             |             |

## test.defaultValue variable

```typescript
defaultValue = 1
```

## test.recall variable

```typescript
recall: () => number
```

## TestClass class

**Unstable:** `beta`



```typescript
export declare class TestClass 
```

### Constructors

1. [`constructor(text: string, callback: () => void)`](#testclassconstructor)
2. [`constructor(text: string, inverse: boolean)`](#testclassconstructor-1)

### Properties

Property                          | Type     | Description |
----------------------------------|----------|-------------|
[`text`](#testclasstext-property) | `string` |             |

## TestClass.(constructor)()

Constructs a new instance of the `TestClass` class.

```typescript
constructor(text: string, callback: () => void)
```

#### Parameters

Parameter  | Type         | Description        |
-----------|--------------|--------------------|
`text`     | `string`     | Text value.        |
`callback` | `() => void` | Callback function. |

## TestClass.(constructor)()

Constructs a new instance of the `TestClass` class.

```typescript
constructor(text: string, inverse: boolean)
```

#### Parameters

Parameter | Type      | Description       |
----------|-----------|-------------------|
`text`    | `string`  | Text value.       |
`inverse` | `boolean` | Reverse the text. |

## TestClass.text property

```typescript
text: string
```

## ABC type



```typescript
export declare type ABC = string
```

## Int type



```typescript
export declare type Int = number
```

## PI_CONSTANT variable

See [Hello.print](#helloprint-method).

```typescript
PI_CONSTANT = 3.14
```

## printMessage variable

**Unstable:** `beta`

Print a welcome message.

```typescript
printMessage: () => void
```
