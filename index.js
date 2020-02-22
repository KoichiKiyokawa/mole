/**
 * @param target_obj {Object}
 * @param target_map {String} 
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
 * you can get animal.marmal.moles[0].name by
 * dig(obj, \`animal: {
 *   marmal: {
 *     moles: [
 *       { name: * }
 *     ]
 *   }
 * }\`)
 */
export function dig(target_obj, target_map) {
  validateBrackets(target_map)

  if (!existsTarget) {
    throw Error('target not found error: you should mark `*` as target')
  }

  const next_target_map = ''

  return dig(target_obj[key], next_target_map)
}

export function countWordInText(word, text) {
  return text.split(word).length - 1
}

// validate that the number of bracketStart equals to bracketEnd
export function validateBrackets(target_map) {
  const BRACKETS = [
    ['{', '}'],
    ['[', ']']
  ]
  for (const [bracketStart, bracketEnd] of BRACKETS) {
    const bracketStartCount = countWordInText(bracketStart, target_map)
    const bracketEndCount = countWordInText(bracketEnd, target_map)
    if (bracketStartCount !== bracketEndCount) {
      // return false
      throw Error(`parse error: brackets are not corresponding. ${bracketStart} is ${bracketStartCount}, but ${bracketEnd} is ${bracketEndCount}`)
    }
  }
}

  function existsTarget(target_map) {
    return countWordInText('*', target_map) >= 1
  }
