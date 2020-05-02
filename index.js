export const $$target = '**target**'
export const $$array = (any) => `$$array(${JSON.stringify(any)})`

/**
 * @param targetObject {Object}
 * @param targetMap {String}
 * @return {any}
 *
 * a string that presents stucture of object you want to dig.
 * you should mark * as target value.
 * e.g.
 * if api's return value is
 * obj = {
 *   animal: {
 *     mammal: {
 *       moles: [
 *         { name: 'Mr. Resetti' },
 *         { name: 'Don Resetti' }
 *       ]
 *     }
 *   }
 * }
 *
 * you can get animal.mammal.moles[1].name by
 * dig(obj, {
 *   animal: {
 *     mammal: {
 *       moles: [
 *         {},
 *         { name: $$target }
 *       ]
 *     }
 *   }
 * })
 *
 * you can customize the marker '*' as you want.
 */
export function dig(targetObject, targetMap, targetMarker = $$target) {
  if (targetMarker.match(/^[a-zA-Z]*$/g)) {
    throw Error('target marker should not be composed of only alphabet')
  }

  if (countWordInText(targetMarker, JSON.stringify(targetMap)) === 0) {
    throw Error(`targetMarker not found error: you should mark ${targetMarker} as target`)
  }

  const strObject = JSON.stringify(targetMap)
  if (strObject.includes('$$array')) {
    const to$$array = strObject.replace(/\$\$array\(.*\)/, $$target)
    const strObjectIn$array = strObject.match(/\$\$array\((.*)\)/)[1]
    console.log({ strObjectIn$array });
    const replacedStrObjectIn$array = strObjectIn$array
      .replace(/\\{1,2}"/g, '"')
      .replace(/\\{3,}"/g, '\"')
    console.log({ replacedStrObjectIn$array })
    // const keysIn$array = deepFindValue(JSON.parse(strObjectIn$array), targetMarker)
    return dig(targetObject, JSON.parse(to$$array))
        .map(elem => dig(elem, JSON.parse(replacedStrObjectIn$array)))
        .flat()
  }

  const keys = deepFindValue(targetMap, targetMarker)
  return digFromKeys(targetObject, keys)
}

function digFromKeys(object, keys) {
  const quotizeKeys = keys.map(key => typeof key === 'string' ? `"${key}"` : key)
  const objectName  = Object.keys({object})[0]
  return eval(`${objectName}[${quotizeKeys.join('][')}]`)
}

/**
 * find a given value from nested object and returns keys' array to reach the key.
 * e.g. object: { a:{ b: 'c' } }
 * deepFindValues(object, 'c')
 *   -> ['a', 'b']
 * @param object {Object}
 * @param valueString {string}
 * @return {string[]}
 */
export function deepFindValue(object, valueString) {
  // e.g. {"animal":{"mammal":{"moles":[{},{"name":"*"}]}}}
  let strObjecet = JSON.stringify(object)

  const keys = []
  while (true) {
    const res = getNearestObjectKeyAndIndexStartToEnd(JSON.parse(strObjecet), valueString)
    const [key, objectStartIndex, objectEndIndex] = res
    keys.push(key)

    if (strObjecet.length === objectEndIndex - objectStartIndex + 1) break

    // replace nearest object by valueString to process recursively.
    // e.g. { animal :{ mammal :{ moles :[{}, '*'] } } }
    strObjecet = strObjecet.substring(0, objectStartIndex) +
      `"${valueString}"` +
      strObjecet.substring(objectEndIndex + 1, strObjecet.length)
  }

  return keys.reverse()
}

/**
 * @param target {Object or Array} e.g. { name: "*" }
 * @param targetMarker {String} e.g. '*'
 * @return {String} key name e.g. 'name'
 *         {Integer} object's start index after JSON.stringify e.g. 0
 *         {Integer} object's  end  index after JSON.stringify e.g. 11
 */
export function getNearestObjectKeyAndIndexStartToEnd(target, targetMarker) {
  const strTarget = JSON.stringify(target)
  // e.g.
  // {"animal":{"mammal":{"moles":[{},{"name":"*"}]}}}
  //                                          ^ firstTargetIndex
  const firstTargetIndex = strTarget.indexOf(`"${targetMarker}"`)
  const searchingIndex = firstTargetIndex - 1

  switch (strTarget.charAt(searchingIndex)) {
    case ':':
      // targetMarker is included in object.

      // e.g.
      // {"animal":{"mammal":{"moles":[{},{"name":"*"}]}}}
      //                                  ^ braceStartIndex
      const braceStartIndex = strTarget.lastIndexOf('{', searchingIndex)

      // e.g.
      // {"animal":{"mammal":{"moles":[{},{"name":"*"}]}}}
      //                                             ^ braceEndIndex
      const braceEndIndex = strTarget.indexOf('}', searchingIndex)

      // e.g. { name: '*' }
      const includedObject = JSON.parse(strTarget.substring(braceStartIndex, braceEndIndex + 1))

      for (const [key, value] of Object.entries(includedObject)) {
        if (value === targetMarker) {
          return [key, braceStartIndex, braceEndIndex]
        }
      }


      case ',':
      case '[':
        // targetMarker is included in array. e.g. { animal :{ mammal :{ moles :[{}, '*']}}}

        // e.g. {"animal":{"mammal":{"moles":[{},"*"]}}}
        //                                   ^ bracketStartIndex
        const bracketStartIndex = strTarget.lastIndexOf('[', searchingIndex)

        // e.g. {"animal":{"mammal":{"moles":[{},"*"]}}}
        //                                           ^ bracketEndIndex
        const bracketEndIndex = strTarget.indexOf(']', searchingIndex)

        // e.g. [{}, '*']
        const includedArray = JSON.parse(strTarget.substring(bracketStartIndex, bracketEndIndex + 1))

        const targetIndex = includedArray.indexOf(targetMarker)

        return [targetIndex, bracketStartIndex, bracketEndIndex]
  }
}

export function countWordInText(word, text) {
  return text.split(word).length - 1
}
