let chai = require('chai')
let should = chai.should()

let string = require('./index')

describe('autoIndent', () => {

  it('indents to leading whitespace by default', () => {
    ({ prefix, selected, suffix } = string.autoIndent('\n', '\t', '\t  function\t', '', '\n'))
    prefix.should.equal('\t  function\t\n\t  ')
    selected.should.equal('')
    suffix.should.equal('\n')
  })

  it('indents to leading whitespace plus depth of last opening parenthesis if one exists on previous line', () => {
    ({ prefix, selected, suffix } = string.autoIndent('\n', '\t', '\t  function(', '', '\n'))
    prefix.should.equal('\t  function(\n\t           ')
    selected.should.equal('')
    suffix.should.equal('\n')
  })

  it('indents to leading whitespace and a tab if previous character is opening curly brace', () => {
    ({ prefix, selected, suffix } = string.autoIndent('\n', '\t', '\t  function() {', '', '\n'))
    prefix.should.equal('\t  function() {\n\t  \t')
    selected.should.equal('')
    suffix.should.equal('\n')
  })

  it('indents to leading whitespace and a tab and puts trailing curly on own line if enclosed with curly braces', () => {
    ({ prefix, selected, suffix } = string.autoIndent('\n', '\t', '\t  function() {', '', '}\n'))
    prefix.should.equal('\t  function() {\n\t  \t')
    selected.should.equal('')
    suffix.should.equal('\n\t  }\n')
  })
})
