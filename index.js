/**
 * @param targetObject {Object}
 * @param targetMap {String} 
 * @return {any}
 *
 * a string that presents stucture of object you want to dig.
 * you should mark * as target value.
 * e.g. 
 * if api's return value is
 * obj = animal: {
 *   marmal: {
 *     moles: [
 *       { name: 'Mr. Resetti' },
 *       { name: 'Don Resetti' }
 *     ]
 * }
 *
 * you can get animal.marmal.moles[1].name by
 * dig(obj, { 
 *   animal: {
 *     marmal: {
 *       moles: [
 *         {},
 *         { name: '*' }
 *       ]
 *     }
 *   }
 * })
 *
 * you can customize the marker '*' as you want.
 */
export function dig(targetObject, targetMap, targetMarker = '*') {
  if (targetMarker.match(/^[a-zA-Z]*$/g)) {
    throw Error('target marker should not be composed of only alphabet')
  }


  if (countWordInText(targetMarker, JSON.stringify(targetMap)) === 0) {
    throw Error(`targetMarker not found error: you should mark ${targetMarker} as target`)
  }

  const keys = deepFindKeys(targetMap, targetMarker)
  for (const key of keys) {
    targetObject = targetObject[key]
  }
  return targetObject
}

export function deepFindKeys(object, searchString) {
  // e.g. {"animal":{"marmal":{"moles":[{},{"name":"*"}]}}}
  let strObjecet = JSON.stringify(object)

  const keys = []
  while (true) {
    const [key, objectStartIndex, objectEndIndex] = getNearestObjectKeyAndIndexStartToEnd(JSON.parse(strObjecet), searchString)
    keys.push(key)

    // replace nearest object by searchString to process recursively.
    // e.g. { animal :{ marmal :{ moles :[{}, '*'] } } }
    strObjecet = strObjecet.substring(0, objectStartIndex) + `"${searchString}"` + strObjecet.substring(objectEndIndex + 1, strObjecet.length)
    if (strObjecet === `"${searchString}"`) break
  }

  return keys.reverse()
}

/**
 * @param strTarget {Object or Array} e.g. { name: '*' }
 * @param targetMarker {String} e.g. '*'
 * @return {String} key name e.g. 'name'
 *         {Integer} object's start index after JSON.stringify e.g. 0
 *         {Integer} object's  end  index after JSON.stringify e.g. 11
 */
export function getNearestObjectKeyAndIndexStartToEnd(target, targetMarker) {
  const strTarget = JSON.stringify(target)
  // e.g.
  // {"animal":{"marmal":{"moles":[{},{"name":"*"}]}}}
  //                                          ^ firstTargetIndex                                      
  const firstTargetIndex = strTarget.indexOf(`"${targetMarker}"`)
  const searchingIndex = firstTargetIndex - 1

  switch (strTarget.charAt(searchingIndex)) {
    case ':':
      // targetMarker is included in object.

      // e.g.
      // {"animal":{"marmal":{"moles":[{},{"name":"*"}]}}}
      //                                  ^ braceStartIndex
      const braceStartIndex = strTarget.lastIndexOf('{', searchingIndex)

      // e.g.
      // {"animal":{"marmal":{"moles":[{},{"name":"*"}]}}}
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
        // targetMarker is included in array. e.g. { animal :{ marmal :{ moles :[{}, '*']}}}

        // e.g. {"animal":{"marmal":{"moles":[{},"*"]}}}
        //                                   ^ bracketStartIndex
        const bracketStartIndex = strTarget.lastIndexOf('[', searchingIndex)

        // e.g. {"animal":{"marmal":{"moles":[{},"*"]}}}
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
