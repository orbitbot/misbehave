'use strict';

export const allNewLines = /\r\n|\r|\n/g

export const onNewLine = /\r\n|\r|\n/

export const leadingWhitespace = /^\s*/

export const allCharacters = /./g

export const removeIfStartsWith = (s) => (line) => line.startsWith(s) ? line.slice(s.length) : line

export const defineNewLine = () => {
  let ta = document.createElement('textarea')
  ta.value = '\n'
  if (ta.value.length === 2)
    return '\r\n'
  else
    return '\n'
}
