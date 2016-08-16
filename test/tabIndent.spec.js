let chai = require('chai');
let should = chai.should();

let string = require('../utils/string')

describe('tabIndent', () => {

  describe('hard tabs', () => {
    it('inserts a tab character by default', () => {
      ({ prefix, selected, suffix } = string.tabIndent('\n', '\t', 'function', '', '\n'))
      prefix.should.equal('function\t')
      selected.should.equal('')
      suffix.should.equal('\n')
    })

    it('indents the whole line if multiple characters are selected on a single line', () => {
      ({ prefix, selected, suffix } = string.tabIndent('\n', '\t', 'funct', 'ion', '\n'))
      prefix.should.equal('\tfunct')
      selected.should.equal('ion')
      suffix.should.equal('\n')
    })

    it('indents all lines with a single tab if multiple lines are selected', () => {
      ({ prefix, selected, suffix } = string.tabIndent('\n', '\t', '[', '\nfst\nsnd\n\ttrd', '\n]'))
      prefix.should.equal('\t[')
      selected.should.equal('\n\tfst\n\tsnd\n\t\ttrd')
      suffix.should.equal('\n]')
    })
  })

  describe('soft tabs', () => {
    it('indents to the next even soft tab width', () => {
      let fst = string.tabIndent('\n', '   ', 'function', '', '\n')
      fst.prefix.should.equal('function   ')
      fst.selected.should.equal('')
      fst.suffix.should.equal('\n')

      let snd = string.tabIndent('\n', '   ', 'func', '', 'tion\n')
      snd.prefix.should.equal('func  ')
      snd.selected.should.equal('')
      snd.suffix.should.equal('tion\n')
    })

    it('indents the whole line if multiple characters are selected on a single line', () => {
      ({ prefix, selected, suffix } = string.tabIndent('\n', '   ', 'funct', 'ion', '\n'))
      prefix.should.equal('   funct')
      selected.should.equal('ion')
      suffix.should.equal('\n')
    })

    it('indents all lines with a single tab if multiple lines are selected', () => {
      ({ prefix, selected, suffix } = string.tabIndent('\n', '   ', '[', '\nfst\nsnd\n  trd', '\n]'))
      prefix.should.equal('   [')
      selected.should.equal('\n   fst\n   snd\n     trd')
      suffix.should.equal('\n]')
    })

  })
})
