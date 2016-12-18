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

exports.allNewLines = allNewLines;
exports.onNewLine = onNewLine;
exports.leadingWhitespace = leadingWhitespace;
exports.allCharacters = allCharacters;
exports.removeIfStartsWith = removeIfStartsWith;
exports.defineNewLine = defineNewLine;
