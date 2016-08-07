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
const insert = (str, line, index, s) => {
  // console.log(`insert ${ s } at ${ line + ',' + index } of ${ str }`)
  let lines = str.split(/\r\n|\r|\n/)
  let lineContent = lines[line]
  // console.log(lineContent, lines)
  lines[line] = lineContent.slice(0, index) + s + lineContent.slice(index)
  // console.log('lines[line]', lines[line])
  return lines.join('\n')
}
const withSelection = (fn) => () => {
  let sel = window.getSelection()
  return fn(sel, sel.getRangeAt(0), getLinePosition(sel.anchorNode), sel.anchorOffset, getLinePosition(sel.focusNode), sel.focusOffset)
}
const setSelection = (elem, start, end) => {
  let range = document.createRange()
  range.setStart(elem, start)
  range.setEnd(elem, end)

  let selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
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

    state.keys.bind('tab', withSelection((select, range, anchorLine, anchorOffset, focusLine, focusOffset) => {
      window.select = select
      window.range = range

      console.log(`start l,r ${ anchorLine + ' ' + anchorOffset } end l,r ${ focusLine + ' ' + focusOffset }`)

      return false
    }))
    state.keys.bind('shift+tab', block)
    state.keys.bind('backspace', log)
    state.keys.bind('enter', log)

    state.keys.bind('mod+z', () => { undoMgr.undo(); return false })
    state.keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    state.keys.bind('(', withSelection((select, range, anchorLine, anchorOffset, focusLine, focusOffset) => {
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

      let update = insert(state.content(), startLine, startOffset, '(')
      update = insert(update, endLine, sameLine ? endOffset + 1 : endOffset , ')')
      state.updateContent(update)
      dom.textContent = state.content()

      return false
    }))
    state.keys.bind('[', log)
    state.keys.bind('{', log)
    state.keys.bind("'", log)
    state.keys.bind('"', log)
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
