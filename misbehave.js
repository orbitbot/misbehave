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
    state.content = m.prop({ prefix: '', selected: '', suffix: '' })
    window.content = state.content
    state.content.map((x) => console.log(x))

    state.setSelection = (elem, prefixLen, rngLen) => {
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

    state.updateContent = (update) => {
      let previous = state.content()
      undoMgr.add({
        undo : () => {
          // console.log('undo w/', previous)
          state.dom.textContent = previous.prefix + previous.selected + previous.suffix
          state.setSelection(state.dom, previous.prefix.length, previous.selected.length)
        },
        redo : () => {
          // console.log('redo w/', update)
          state.dom.textContent = update.prefix + update.selected + update.suffix
          state.setSelection(state.dom, update.prefix.length, update.selected.length)
        }
      })
      state.content(update)
    }
    state.extractSections = (fn) => {
      return withStartEnd((selection, range, startLine, startOffset, endLine, endOffset) => {
        let prefixIndex = nthOccurrance(state.dom.textContent, '\n', startLine) + startOffset
        let prefix = state.dom.textContent.slice(0, prefixIndex)
        let selected = range.toString()
        let suffix = state.dom.textContent.slice(prefixIndex + selected.length)

        console.info('extracted', [prefix, selected, suffix])

        return fn(selection, range, prefix, selected, suffix)
      })
    }
  },

  oncreate : ({ state, dom }) => {
    state.dom = dom
    state.keys = new Combokeys(dom)
    state.keys.stopCallback = () => false // work without needing to set combokeys class on elements

    state.keys.bind('tab', state.extractSections((selection, range, prefix, selected, suffix) => {

      prefix += '\t'
      state.updateContent({ prefix, selected, suffix })

      dom.textContent = prefix + selected + suffix
      state.setSelection(dom, prefix.length, selected.length)

      return false
    }))
    state.keys.bind('shift+tab', block)
    state.keys.bind('backspace', log)
    state.keys.bind('enter', log)

    state.keys.bind('mod+z', () => { undoMgr.undo(); return false })
    state.keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    const autoOpen = (openChar, closeChar) => {
      return state.extractSections((selection, range, prefix, selected, suffix) => {

        prefix += openChar
        suffix = closeChar + suffix
        state.updateContent({ prefix, selected, suffix })

        dom.textContent = prefix + selected + suffix
        state.setSelection(dom, prefix.length, selected.length)

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

  view : ({ state, dom }) => {
    return m('code', {
      contenteditable : true,
      oninput : state.extractSections((selection, range, prefix, selected, suffix) => {
        state.updateContent({ prefix, selected, suffix })
      })
    })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild && e.target.firstChild.focus() } }, m(code))
}

m.render(document.body, m(editor))
