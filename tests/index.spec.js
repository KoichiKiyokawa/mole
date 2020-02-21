import { dig } from "../index" 

describe('dig object', () => {
  const object = {
    animal: {
      marmal: {
        moles: [
          {
            name: 'Mr. Resetti'
          },
          {
            name: 'Don Resetti'
          }
        ]
      }
    }
  }

  const result = dig(object, `
    animal: { marmal: moles: [{name: *}] }
  `)
  expect('Mr. Resetti', result)


  it('isBracketValid', () => {
    expect
  })
})
