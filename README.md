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
object.animal.mammal.moles[1] // => 'Don Resetti'
```
This code does not show the composition of the object, so it is difficult to understand how is the `object`.

On the other hand, with this library,
```js
import { dig } from 'visually-digger'

dig(object, {
  animal: {
    marmal: {
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

## License
[MIT](LICENSE)
