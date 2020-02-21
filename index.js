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
  if (!isBracketValid(target_map)) {
    throw Error('parse error: brackets are not corresponding')
  }

  if (!existsTarget){
    throw Error('target not found error: you should mark `*` as target')
  }

  const next_target_map = ''

  return dig(target_obj[key], next_target_map)
}

function countWordInText(word, text) {
  return text.split(word).lenth - 1
}

// validate that the number of bracketStart equals to bracketEnd
function isBracketValid(target_map) {

  const BRACKETS = [
    ['{', '}'],
    ['[', ']']
  ]
  for (const [bracketStart, bracketEnd] of BRACKETS) {
    const bracketStartCount = countWordInText(bracketStart, target_map)
    const bracketEndCount = countWordInText(bracketEnd, target_map)
    if (bracketStartCount !== bracketEndCount) {
      return false
    }
  }

  return true
}

function existsTarget(target_map) {
  return countWordInText('*', target_map) >= 1
}
