import {
  dig,
  countWordInText,
  getNearestObjectKeyAndIndexStartToEnd
} from "../index"

describe('dig object', () => {
  const object = {
    animal: {
      marmal: {
        moles: [{
            name: 'Mr. Resetti'
          },
          {
            name: 'Don Resetti'
          }
        ]
      }
    }
  }

  const targetMap = {
    animal: {
      marmal: {
        moles: [{},
          {
            name: '***'
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
        name: '*'
      },
      second: {
        name: 'dummy'
      }
    }, '*')
    expect(key).toBe('name')
    // {"first":{"name":"*"},"second":{"name":"dummy"}}
    //          ^          ^
    // 012345678901234567890123456789012345678901234567
    expect(startIndex).toBe(9)
    expect(endIndex).toBe(20)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd([{}, '*'], '*')
    expect(key).toBe(1)
    // [{},"*"]
    // 01234567
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(7)
  })

  test('get nearest key from array', () => {
    const [key, startIndex, endIndex] = getNearestObjectKeyAndIndexStartToEnd(['*', {}], '*')
    expect(key).toBe(0)
    // ["*",{}]
    // 01234567
    expect(startIndex).toBe(0)
    expect(endIndex).toBe(7)
  })

})
