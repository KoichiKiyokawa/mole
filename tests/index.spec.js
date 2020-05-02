import {
  $$target,
  $$array,
  dig,
  countWordInText,
  deepFindValue,
  getNearestObjectKeyAndIndexStartToEnd
} from "../index"

describe('dig object', () => {
  const targetMap = {
    animal: {
      mammal: {
        moles: [{},
          {
            name: $$target
          }
        ]
      }
    }
  }

  test('word count', () => {
    expect(countWordInText('***', '***|***')).toBe(2)
    expect(countWordInText('{', JSON.stringify(targetMap))).toBe(5)
    expect(countWordInText('}', JSON.stringify(targetMap))).toBe(5)
    expect(countWordInText('[', JSON.stringify(targetMap))).toBe(1)
    expect(countWordInText(']', JSON.stringify(targetMap))).toBe(1)
    expect(countWordInText($$target, JSON.stringify(targetMap))).toBe(1)
  })

  test('get nearest key from object', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      name: '*'
    }, '*')
    expect(key).toBe('name')
    // {"name":"*"}
    // 012345678901
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(11)
  })

  test('get nearest key from nested object', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      first: {
        name: $$target
      },
      second: {
        name: 'dummy'
      }
    }, $$target)
    expect(key).toBe('name')
    // {"first":{"name":"**target**"},"second":{"name":"dummy"}}
    //          ^                   ^
    // 012345678901234567890123456789012345678901234567
    expect(startIndex).toBe(9)
    expect(endIndex).toBe(29)
  })

  test('get nearest key from nested object if targetMarker is changed', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd({
      first: {
        name: '***'
      },
      second: {
        name: 'dummy'
      }
    }, '***')
    expect(key).toBe('name')
    // {"first":{"name":"***"},"second":{"name":"dummy"}}
    //          ^            ^
    // 012345678901234567890123456789012345678901234567
    expect(startIndex).toBe(9)
    expect(endIndex).toBe(22)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd([{}, $$target], $$target)
    expect(key).toBe(1)
    // [{},"**target**"]
    // 01234567890123456
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(16)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd([$$target, {}], $$target)
    expect(key).toBe(0)
    // ["**target**",{}]
    // 01234567890123456
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(16)
  })

  test('deepFindValue in simple object', () => {
    expect(deepFindValue({
      name: $$target
    }, $$target)).toEqual(['name'])
  })

  test('deepFindValue in simple array', () => {
    expect(deepFindValue([0, 1, $$target], $$target)).toEqual([2])
  })

  test('deepFindValue in simple array if marker changed', () => {
    expect(deepFindValue([0, 1, '***'], '***')).toEqual([2])
  })

  test('deepFindValue with object included by array', () => {
    expect(deepFindValue([0, 1, {
      name: $$target
    }], $$target)).toEqual([2, 'name'])
  })

  test('deepFindValue with nested object', () => {
    expect(deepFindValue([0, 1, {
      first: {
        second: {
          third: {
            name: $$target
          }
        }
      }
    }], $$target)).toEqual([2, 'first', 'second', 'third', 'name'])
  })

  test("deepFindValue in nested object includes array(and include empty string)", () => {
    expect(deepFindValue({
      animal: {
        mammal: {
          moles: [, { name: $$target } ]
        }
      }
    }, $$target)).toEqual(['animal', 'mammal', 'moles', 1, 'name'])
  })

  const obj = {
    animal: {
      mammal: {
        moles: [
          { name: 'Mr. Resetti' },
          { name: 'Don Resetti' }
        ]
      }
    }
  }

  test("dig second mole's name", () => {
    const result = dig(obj, {
      animal: {
        mammal: {
          moles: [, { name: $$target } ]
        }
      }
    })
    expect(result).toBe('Don Resetti')
  })

  test("dig moles' name array", () => {
    const result = dig(obj, {
      animal: {
        mammal: {
          moles: $$array({ name: $$target })
        }
      }
    })
    expect(result).toEqual(['Mr. Resetti', 'Don Resetti'])
  })

  test('dig from 2 level nested $$array', () => {
    const nestedObj = {
      animal: {
        mammal: {
          moles: [
            {
              name: 'parent1',
              children: [{ name: 'child1-1' }, { name: 'child1-2' }]
            },
            {
              name: 'parent2',
              children: [{ name: 'child2-1' }, { name: 'child2-2' }]
            }
          ]
        }
      }
    }
    const result = dig(nestedObj, {
      animal: {
        mammal: {
          moles: $$array({
            children: $$array({ name: $$target })
          })
        }
      }
    })
    expect(result).toEqual(['child1-1', 'child1-2', 'child2-1', 'child2-2'])
  })

  test.skip('dig from 3 level nested $$array', () => {
    const threeLevelNestedObj = {
      animal: {
        mammal: {
          moles: [
            {
              name: 'parent1',
              children: [
                {
                  name: 'child1-1',
                  grandchildren: [
                    { name: 'grandchild1-1-1' },
                    { name: 'grandchild1-1-2' }
                  ]
                },
                {
                  name: 'child1-2',
                  grandchildren: [
                    { name: 'grandchild1-2-1' },
                    { name: 'grandchild1-2-2' }
                  ]
                }
              ]
            },
            {
              name: 'parent2',
              children: [
                {
                  name: 'child2-1',
                  grandchildren: [
                    { name: 'grandchild2-1-1' },
                    { name: 'grandchild2-1-2' }
                  ]
                },
                {
                  name: 'child2-2',
                  grandchildren: [
                    { name: 'grandchild2-2-1' },
                    { name: 'grandchild2-2-2' }
                  ]
                }
              ]
            }
          ]
        }
      }
    }

    const result = dig(threeLevelNestedObj, {
      animal: {
        mammal: {
          moles: $$array({
            children: $$array({
              grandchildren: $$array({ name: $$target })
            })
          })
        }
      }
    })

    expect(result).toEqual([
      'grandchild1-1-1',
      'grandchild1-1-2',
      'grandchild1-2-1',
      'grandchild1-2-2',
      'grandchild2-1-1',
      'grandchild2-1-2',
      'grandchild2-2-1',
      'grandchild2-2-2'
    ])
  })
})
