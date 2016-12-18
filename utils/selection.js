"use strict"

export const getSections = (elem, callback) => {
  var sel, range, tempRange, prefix = '', selected = '', suffix = ''

  if (typeof window.getSelection !== 'undefined') {
    sel = window.getSelection()
    selected = sel.toString()
    if (sel.rangeCount) {
      range = sel.getRangeAt(0)
    } else {
      range = document.createRange()
      range.collapse(true)
    }
    tempRange = document.createRange()
    tempRange.selectNodeContents(elem)
    tempRange.setEnd(range.startContainer, range.startOffset)
    prefix = tempRange.toString()

    tempRange.selectNodeContents(elem)
    tempRange.setStart(range.endContainer, range.endOffset)
    suffix = tempRange.toString()

    tempRange.detach()
  } else if ( (sel = document.selection) && sel.type != 'Control') {
    range = sel.createRange()
    tempRange = document.body.createTextRange()
    selected = tempRange.text

    tempRange.moveToElementText(elem)
    tempRange.setEndPoint('EndToStart', range)
    prefix = tempRange.text

    tempRange.moveToElementText(elem)
    tempRange.setEndPoint('StartToEnd', range)
    suffix = tempRange.text
  }

  console.info('extracted', [prefix, selected, suffix])

  if (callback)
    return callback({ prefix, selected, suffix }, sel)
  else
    return { prefix, selected, suffix }
}

const getTextNodesIn = (node) => {
  var textNodes = []
  if (node.nodeType == 3) {
    textNodes.push(node)
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]))
    }
  }
  return textNodes
}

export const setSelection = (elem, start, end) => {
  if (document.createRange && window.getSelection) {
    var range = document.createRange()
    range.selectNodeContents(elem)
    var textNodes = getTextNodesIn(elem)
    var foundStart = false
    var charCount = 0, endCharCount

    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
      endCharCount = charCount + textNode.length
      if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
        range.setStart(textNode, start - charCount)
        foundStart = true
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount)
        break
      }
      charCount = endCharCount
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange()
    textRange.moveToElementText(elem)
    textRange.collapse(true)
    textRange.moveEnd('character', end)
    textRange.moveStart('character', start)
    textRange.select()
  }
}
