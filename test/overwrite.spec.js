let chai = require('chai')
let should = chai.should()

let string = require('../utils/string')

describe('overwrite', () => {

  it('moves selection forwards one character', () => {
    ({ prefix, selected, suffix } = string.overwrite(')', '(', '', ')'))
    prefix.should.equal('()')
    selected.should.equal('')
    suffix.should.equal('')
  })

  describe('test', () => {
    it('returns true if character should be overwritten', () => {
      string.testOverwrite(')', '(', '', ')').should.equal(true)
    })

    it('returns false if character should not be overwritten', () => {
      string.testOverwrite(')', '(', '', ']').should.equal(false)
    })
  })
})
