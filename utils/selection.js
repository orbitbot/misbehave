"use strict"

import { onNewLine } from './utils'

export let getLinePosition = (node) => {
  let text = ''
  let sibling = node.previousSibling
  while (sibling) {
    text += sibling.textContent
    sibling = sibling.previousSibling
  }
  return text.split(onNewLine).length - 1
}

export let withSelection = (fn) => () => {
  let sel = window.getSelection()
  return fn(sel, sel.getRangeAt(0), getLinePosition(sel.anchorNode), sel.anchorOffset, getLinePosition(sel.focusNode), sel.focusOffset)
}

export let withStartEnd = (fn) => {
  return withSelection((selection, range, anchorLine, anchorOffset, focusLine, focusOffset) => {
    console.log(`start l,r ${ anchorLine + ' ' + anchorOffset } end l,r ${ focusLine + ' ' + focusOffset }`)
    // calls fn with (selection, range, startLine, startOffset, endLine, endOffset)
    if (anchorLine == focusLine) {
      return fn(selection, range, anchorLine, Math.min(anchorOffset, focusOffset), anchorLine, Math.max(anchorOffset, focusOffset))
    } else if (anchorLine < focusLine) {
      return fn(selection, range, anchorLine, anchorOffset, focusLine, focusOffset)
    } else {
      return fn(selection, range, focusLine, focusOffset, anchorLine, anchorOffset)
    }
  })
}

export let setSelection = (elem, prefixLen, rngLen) => {
  let node
  if (elem.childNodes[0]) {
    node = elem.childNodes[0]
  } else {
    node = elem
    prefixLen, rngLen = 0
  }
  let selection = document.getSelection()
  let range = document.createRange()
  range.setStart(node, prefixLen)
  range.setEnd(node, prefixLen + rngLen)
  selection.removeAllRanges()
  selection.addRange(range)
}
