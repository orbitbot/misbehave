'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

let allNewLines = /\r\n|\r|\n/g

let onNewLine = /\r\n|\r|\n/

let leadingWhitespace = /^\s*/

let allCharacters = /./g

let removeIfStartsWith = (s) => (line) => { return line.startsWith(s) ? line.slice(s.length) : line }

let defineNewLine = () => {
  let ta = document.createElement('textarea')
  ta.value = '\n'
  if (ta.value.length === 2)
    return '\r\n';
  else
    return '\n';
}

let nthOccurrance = (string, character, n) => {
  var count = 0, i = 0;
  while (count < n && (i = string.indexOf(character, i) + 1)) {
    count++;
  }
  if (count == n) return i;
  return NaN;
}

exports.allNewLines = allNewLines;
exports.onNewLine = onNewLine;
exports.leadingWhitespace = leadingWhitespace;
exports.allCharacters = allCharacters;
exports.removeIfStartsWith = removeIfStartsWith;
exports.defineNewLine = defineNewLine;
exports.nthOccurrance = nthOccurrance;
