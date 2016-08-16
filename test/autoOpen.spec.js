let chai = require('chai');
let should = chai.should();

let string = require('../utils/string')

describe('autoOpen', () => {

  it('works without text selected', () => {
    ({ prefix, selected, suffix } = string.autoOpen('(', ')', '', '', '\t'))
    prefix.should.equal('(')
    selected.should.equal('')
    suffix.should.equal(')\t')
  })

  it('works with text selected', () => {
    ({ prefix, selected, suffix } = string.autoOpen('(', ')', '', 'moo', '\t'))
    prefix.should.equal('(')
    selected.should.equal('moo')
    suffix.should.equal(')\t')
  })

  it('works with random content', () => {
    let pref = Math.random().toString(36).slice(2, 8)
    let slct = Math.random().toString(36).slice(2, 8)
    let suff = Math.random().toString(36).slice(2, 8)

    result = string.autoOpen('[', ']', pref, slct, suff)
    result.prefix.should.equal(pref + '[')
    result.selected.should.equal(slct)
    result.suffix.should.equal(']' + suff)
  })
})
