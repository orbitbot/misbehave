let chai = require('chai');
let should = chai.should();

let string = require('../utils/string')

describe('tabUnindent', () => {

  it('unindents if there is a tab before the selection', () => {
    ({ prefix, selected, suffix } = string.tabUnindent('\n', '\t', 'function\t', '', '\n'))
    prefix.should.equal('function')
    selected.should.equal('')
    suffix.should.equal('\n')
  })

  it('indents if there is not a tab before the selection', () => {
    ({ prefix, selected, suffix } = string.tabUnindent('\n', '   ', 'func', '', 'tion\n'))
    prefix.should.equal('func  ')
    selected.should.equal('')
    suffix.should.equal('tion\n')
  })

  it('removes tab characters if multiple lines are selected', () => {
    ({ prefix, selected, suffix } = string.tabUnindent('\n', '   ', '   [', '\n   fst\n   snd\n     trd', '\n]'))
    prefix.should.equal('[')
    selected.should.equal('\nfst\nsnd\n  trd')
    suffix.should.equal('\n]')
  })
})
