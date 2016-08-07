import m from 'mithril'
import Combokeys from 'combokeys'
import UndoManager from 'undo-manager'

let undoMgr = new UndoManager()

const log = (e, combo) => { console.log(combo) }
const block = (e, combo) => { console.log(combo); return false; }


const getLinePosition = (node) => {
  let text = ''
  let sibling = node.previousSibling
  while (sibling) {
    text += sibling.textContent
    sibling = sibling.previousSibling
  }
  return text.split(/\r\n|\r|\n/).length - 1
}
const withSelection = (fn) => () => {
  let sel = window.getSelection()
  return fn(sel, sel.getRangeAt(0), getLinePosition(sel.anchorNode), sel.anchorOffset, getLinePosition(sel.focusNode), sel.focusOffset)
}
const withStartEnd = (fn) => {
  return withSelection((selection, range, anchorLine, anchorOffset, focusLine, focusOffset) => {
    console.log(`start l,r ${ anchorLine + ' ' + anchorOffset } end l,r ${ focusLine + ' ' + focusOffset }`)
    let startLine, startOffset, endLine, endOffset, sameLine
    if (anchorLine == focusLine) {
      startLine = anchorLine
      startOffset = Math.min(anchorOffset, focusOffset)
      endLine = anchorLine
      endOffset = Math.max(anchorOffset, focusOffset)
      sameLine = true
    } else if (anchorLine < focusLine) {
      startLine = anchorLine
      startOffset = anchorOffset
      endLine = focusLine
      endOffset = focusOffset
    } else {
      startLine = focusLine
      startOffset = focusOffset
      endLine = anchorLine
      endOffset = anchorOffset
    }
    return fn(selection, range, startLine, startOffset, endLine, endOffset, sameLine)
  })
}
const nthOccurrance = (string, character, n) => {
  // might have issue on different platforms, see https://github.com/iamso/Behave.js/blob/master/behave.js#L147
  var count = 0, i = 0;
  while (count < n && (i = string.indexOf(character, i) + 1)) {
    count++;
  }
  if (count == n) return i;
  return NaN;
}

let code = {

  oninit : ({ state }) => {
    state.content = m.prop('')
    window.content = state.content
    state.content.map((x) => console.log(x))

    state.updateContent = (update) => {
      let previous = state.content()
      undoMgr.add({
        undo : () => { state.dom.textContent = previous },
        redo : () => { state.dom.textContent = update }
      })
      state.content(update)
    }
  },

  oncreate : ({ state, dom }) => {
    state.dom = dom
    state.keys = new Combokeys(dom)
    state.keys.stopCallback = () => false // work without needing to set combokeys class on elements

    const extractSections = (fn) => {
      return withStartEnd((selection, range, startLine, startOffset, endLine, endOffset, sameLine) => {
        let prefixIndex = nthOccurrance(dom.textContent, '\n', startLine) + startOffset
        let prefix = dom.textContent.slice(0, prefixIndex)
        let content = range.toString()
        let suffix = dom.textContent.slice(prefixIndex + content.length)

        console.info('prefix', prefix)
        console.info('content', content)
        console.info('suffix', suffix)

        return fn(selection, range, prefix, content, suffix)
      })
    }

    state.keys.bind('tab', extractSections((selection, range, prefix, content, suffix) => {

      let update = prefix + '\t' + content + suffix
      state.updateContent(update)
      dom.textContent = state.content()

      let newRange = document.createRange()
      newRange.setStart(dom.childNodes[0], prefix.length + 1)
      newRange.setEnd(dom.childNodes[0], prefix.length + 1 + content.length)
      selection.removeAllRanges()
      selection.addRange(newRange)

      return false
    }))
    state.keys.bind('shift+tab', block)
    state.keys.bind('backspace', log)
    state.keys.bind('enter', log)

    state.keys.bind('mod+z', () => { undoMgr.undo(); return false })
    state.keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    const autoOpen = (openChar, closeChar) => {
      return extractSections((selection, range, prefix, content, suffix) => {

        let update = prefix + openChar + content + closeChar + suffix
        state.updateContent(update)
        dom.textContent = state.content()

        let newRange = document.createRange()
        newRange.setStart(dom.childNodes[0], prefix.length + 1)
        newRange.setEnd(dom.childNodes[0], prefix.length + 1 + content.length)
        selection.removeAllRanges()
        selection.addRange(newRange)

        return false
      })
    }

    state.keys.bind('(', autoOpen('(', ')'))
    state.keys.bind('[', autoOpen('[', ']'))
    state.keys.bind('{', autoOpen('{', '}'))
    state.keys.bind("'", autoOpen("'", "'"))
    state.keys.bind('"', autoOpen('"', '"'))
  },

  onremove : ({ state }) => {
    state.keys.detach()
  },

  view : ({ state }) => {
    return m('code', {
      contenteditable : true,
      oninput : m.withAttr('textContent', state.updateContent)
    })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild && e.target.firstChild.focus() } }, m(code))
}

m.render(document.body, m(editor))
