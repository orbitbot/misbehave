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

    state.setDom = (value) => {
      state.dom.textContent = value.prefix + value.selected + value.suffix
      state.setSelection(state.dom, value.prefix.length, value.selected.length)
    }

    state.updateContent = (update, updateDom) => {
      // this should probably track document selectionchange w/ activeElemet to have undo/redo block selections work,
      // eg selection on should be whatever it was before keydown when going backwards (messes up forward history navigation?)
      let previous = state.content()
      undoMgr.add({
        undo : () => { state.setDom(previous) },
        redo : () => { state.setDom(update) }
      })
      state.content(update)
      if (updateDom) state.setDom(update)
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
      selected = selected.replace(/\n/g, '\n\t')
      state.updateContent({ prefix, selected, suffix }, true)

      return false
    }))
    state.keys.bind('shift+tab', state.extractSections((selection, range, prefix, selected, suffix) => {
      let lines = selected.split('\n')
      if (lines.length === 1) {
        if (prefix.slice(-1) === '\t')
          prefix = prefix.slice(0, -1)
        else
          prefix += '\t' // indent forward
      } else {
        if (prefix.slice(-1) === '\t')
          prefix = prefix.slice(0, -1)
        lines = lines.map((line) => {
          return line.replace(/^\t/, '')
        })
        selected = lines.join('\n')
      }
      state.updateContent({ prefix, selected, suffix }, true)

      return false
    }))
    state.keys.bind('backspace', state.extractSections((selection, range, prefix, selected, suffix) => {
      let prefEnd = prefix.slice(-1)
      let suffStart = suffix.charAt(0)
      if (selection.isCollapsed &&
          (prefEnd === '(' && suffStart === ')') ||
          (prefEnd === '{' && suffStart === '}') ||
          (prefEnd === '[' && suffStart === ']') ||
          (prefEnd === '"' && suffStart === '"') ||
          (prefEnd === "'" && suffStart === "'")) {
        prefix = prefix.slice(0, -1)
        suffix = suffix.slice(1)
        state.updateContent({ prefix, selected, suffix }, true)
        return false
      }
    }))
    state.keys.bind('enter', state.extractSections((selection, range, prefix, selected, suffix) => {
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
      state.updateContent({ prefix, selected, suffix }, true)
      return false
    }))

    state.keys.bind('mod+z', () => { undoMgr.undo(); return false })
    state.keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    const autoOpen = (openChar, closeChar) => {
      return state.extractSections((selection, range, prefix, selected, suffix) => {
        prefix += openChar
        suffix = closeChar + suffix
        state.updateContent({ prefix, selected, suffix }, true)

        return false
      })
    }

    const overwrite = (closeChar) => {
      return state.extractSections((selection, range, prefix, selected, suffix) => {
        if (selection.isCollapsed && suffix.charAt(0) === closeChar) {
          prefix += closeChar
          suffix = suffix.slice(1)
          state.updateContent({ prefix, selected, suffix }, true)
          return false
        }
      })
    }

    const pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"', '"'], ['"', '"']]
    pairs.forEach(([opening, closing]) => {
      state.keys.bind(opening, autoOpen(opening, closing))
      state.keys.bind(closing, overwrite(closing))
    })
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
