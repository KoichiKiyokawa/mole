import {
  dig,
  validateBrackets,
  countWordInText
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

  const target_map = `animal: { marmal: moles: [{name: *}] }`

  test('word count', () => {
    expect(countWordInText('*', '***')).toBe(3)
    expect(countWordInText('{', target_map)).toBe(2)
    expect(countWordInText('}', target_map)).toBe(2)
    expect(countWordInText('[', target_map)).toBe(1)
    expect(countWordInText(']', target_map)).toBe(1)
  })

  test('brackets are valid', () => {
    expect(() => { validateBrackets(target_map) })
  })
})
