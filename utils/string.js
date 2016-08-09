"use strict"

export let autoIndent = (newLine, tab, prefix, selected, suffix) => {
  // if surrounding parenthesis, indent to current depth
  // if opening curly brace, indent to current + tab
  // ++ if closing curly, put on own newline, indent to current
  //
  // otherwise indent to leading whitespace
  let prevLine = prefix.split('\n').splice(-1)[0]
  console.log('prevLine', JSON.stringify(prevLine))
  let prefEnd = prefix.slice(-1)
  let suffStart = suffix.charAt(0)
  if (prefEnd === '(' && suffStart === ')') {
    prefix += '\n' + ' '.repeat(prevLine.length) // this should consider tabs/softTabs
  } else if (prefEnd === '{') {
    prefix += '\n' + prevLine.match(/^\s*/)[0] + '\t'
    if (suffStart === '}')
      suffix = '\n' + prevLine.match(/^\s*/)[0] + suffix
  } else {
    prefix += '\n' + prevLine.match(/^\s*/)[0]
  }
  selected = ''
  return { prefix, selected, suffix }
}

export let autoOpen = (opening, closing, prefix, selected, suffix) => {
  prefix += opening
  suffix = closing + suffix
  return { prefix, selected, suffix }
}

export let autoStrip = (prefix, selected, suffix) => {
  prefix = prefix.slice(0, -1)
  suffix = suffix.slice(1)
  return { prefix, selected, suffix }
}

export let testAutoStrip = (prefix, selected, suffix) => {
  let prefEnd = prefix.slice(-1)
  let suffStart = suffix.charAt(0)
  return ((prefEnd === '(' && suffStart === ')') ||
          (prefEnd === '{' && suffStart === '}') ||
          (prefEnd === '[' && suffStart === ']') ||
          (prefEnd === '"' && suffStart === '"') ||
          (prefEnd === "'" && suffStart === "'"))
}

export let overwrite = (closing, prefix, selected, suffix) => {
  prefix += closing
  suffix = suffix.slice(1)
  return { prefix, selected, suffix }
}

export let testOverwrite = (closing, prefix, selected, suffix) => {
  return suffix.charAt(0) === closeChar
}

export let tabIndent = (newLine, tab, prefix, selected, suffix) => {
  prefix += tab
  selected = selected.replace(/\r\n|\r|\n/g, newLine + tab)
  return { prefix, selected, suffix }
}

// todo : soft tab functionality, will only work with tab char
export let tabUnindent = (newLine, tab, prefix, selected, suffix) => {
  let lines = selected.split('\n')
  if (lines.length === 1) {
    if (prefix.slice(-1) === '\t')
      prefix = prefix.slice(0, -1)
    else
      prefix += '\t' // indent instead
  } else {
    if (prefix.slice(-1) === '\t') // should actually check if previous line starts with tab and remove
      prefix = prefix.slice(0, -1)
    lines = lines.map((line) => {
      return line.replace(/^\t/, '')
    })
    selected = lines.join(newLine)
  }
  return { prefix, selected, suffix }
}

export default function StrUtil(newLine, tab) {
  return {
    autoIndent    : (...args) => autoIndent(newLine, tab, ...args),
    autoOpen      : autoOpen,
    autoStrip     : autoStrip,
    testAutoStrip : testAutoStrip,
    overwrite     : overwrite,
    testOverwrite : testOverwrite,
    tabIndent     : (...args) => tabIndent(newLine, tab, ...args),
    tabUnindent   : (...args) => tabUnindent(newLine, tab, ...args)
  }
}
