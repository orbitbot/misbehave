let chai = require('chai');
let should = chai.should();

let string = require('../utils/string')

describe('autoStrip', () => {

  it('removes trailing and leading character from prefix and suffix', () => {
    ({ prefix, selected, suffix } = string.autoStrip('\t(', '', ')'))
    prefix.should.equal('\t')
    selected.should.equal('')
    suffix.should.equal('')
  })

  describe('test', () => {
    it('returns true if prefix and suffix ends with and starts with paired characters', () => {
      string.testAutoStrip([['(', ')'], ['[', ']']], '(', '', ')').should.equal(true)
    })

    it('returns false if prefix and suffix do not end and start with paired characters', () => {
      string.testAutoStrip([['(', ')'], ['[', ']']], '(', '', ']').should.equal(false)
    })
  })
})
