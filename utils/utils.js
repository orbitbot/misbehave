"use strict"

export let allNewLines = /\r\n|\r|\n/g

export let onNewLine = /\r\n|\r|\n/

export let leadingWhitespace = /^\s*/

export let allCharacters = /./g

export let removeIfStartsWith = (s) => (line) => { return line.startsWith(s) ? line.slice(s.length) : line }

export let defineNewLine = () => {
  let ta = document.createElement('textarea')
  ta.value = '\n'
  if (ta.value.length === 2)
    return '\r\n';
  else
    return '\n';
}

export let nthOccurrance = (string, character, n) => {
  var count = 0, i = 0;
  while (count < n && (i = string.indexOf(character, i) + 1)) {
    count++;
  }
  if (count == n) return i;
  return NaN;
}
