# visually-digger
![](https://github.com/KoichiKiyokawa/visually-digger/workflows/GitHub%20Actions/badge.svg)
[![npm version](https://badge.fury.io/js/visually-digger.svg)](https://badge.fury.io/js/visually-digger)
[![GitHub issues](https://img.shields.io/github/issues/KoichiKiyokawa/visually-digger)](https://github.com/KoichiKiyokawa/visually-digger/issues)
[![GitHub license](https://img.shields.io/github/license/KoichiKiyokawa/visually-digger)](https://github.com/KoichiKiyokawa/visually-digger)

## Introduction
JavaScript library to dig nested object returned from api.

If api endpoint returns,
```js
{ 
  animal: {
   mammal: {
     moles: [
       { name: 'Mr. Resetti' },
       { name: 'Don Resetti' }
     ]
  }
}
```
and you want to get `'Don Resetti'`, with pure javascript,
```js
object.animal.mammal.moles[1].name // => 'Don Resetti'
```
This code does not show the composition of the object, so it is difficult to understand how is the `object`.

On the other hand, with this library,
```js
import { dig } from 'visually-digger'

dig(object, {
  animal: {
    mammal: {
      moles: [
        { name: '_' },
        { name: '*' } // `*` show the target value you want to get.
      ]
    }
  }
})
// => 'Don Resetti'
```

## Quick start
### Install
```console
npm i visually-digger
```
or
```console
yarn add visually-digger
```

### How to use
```js
import { dig } from 'visually-digger'

dig(<target_object>, <target_map>, <target_marker>)
```
argument|description
--|--
target_object|object or array you want to dig
target_map|object or array presenting target location, by marking target with `target_marker`
target_marker|optional, default is `*`

Note that target_marker should _NOT_ be included in any keys of <target_object>.
if included, it will cause a bug.  
Bad example:
```js
const object = { '*foo': { bar: 1} }
dig(object, { '*foo': { bar: '*' } }
```
You should change target_marker like this.
```js
dig(object, { '*foo': { bar: '***' } }, '***')
```

## Algorithm
1. Convert target_map to JSON string.
```js
JSON.stringify(target_map)
// => {"animal":{"mammal":{"moles":[{"name":"_"},{"name":"*"}]}}}
```
2. From the result of 1, search a object or array that includes target_marker.
```js
{"animal":{"mammal":{"moles":[{"name":"_"},{"name":"*"}]}}}
//                                         ^^^^^^^^^^^^
=> {"name":"*"}
```
3. From the result of 2. get the key and memorize it.
```js
{"name":"*"}
=> 'name'
// keys <- 'name'
```
4. replace the result of 2. by target_marker.
```js
{"animal":{"mammal":{"moles":[{"name":"_"},{"name":"*"}]}}}
//                                         ^^^^^^^^^^^^
// replace => {"animal":{"mammal":{"moles":[{"name":"_"},"*"]}}}
```
5. From the result of 4, search a object or array that includes target_marker(like 2.)
```js
{"animal":{"mammal":{"moles":[{"name":"_"},"*"]}}}
//                           ^^^^^^^^^^^^^^^^^^
```
6. get the key(or index) and memorize it.
```js
[{"name":"_"},"*"]
=> 1 (index)
// keys <- 1
// keys: ['name', 1]
```
7. repeat until the result of replacement is same as target_marker.
```js
keys: ['name', 1, 'moles', 'mammal', 'animal']
```
8. Using keys, dig a target object
```js
let value = object
for (const key of keys.reverse()) {
 value = value[key]
}
value // => 'Don Resetti' (same as object.animal.mammal.moles[1].name)
```

## Caution
If a target object consists only of object, you should just use pure JavaScript like this.
```js
// object: { animal: { mamal: { mole: 'Mr. Resetti' } } }
const { animal: { mamal: { mole } } } = object
console.log(mole) // => 'Mr. Resetti'
```
But, if a target object contains some arrays, this library will be helpful.

## License
[MIT](LICENSE)
