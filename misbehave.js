import m from 'mithril'
import Combokeys from 'combokeys'

const log = (e, combo) => { console.log(combo) }
const block = (e, combo) => { console.log(combo); return false; }


const insert = (str, index, s) => { return str.slice(0, index) + s + str.slice(index) }
const withSelection = (fn) => () => {
  let sel = window.getSelection()
  let range = sel.getRangeAt(0)
  return fn(sel, range, range.startOffset, range.endOffset)
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
  },

  oncreate : ({ state, dom }) => {
    state.keys = new Combokeys(dom)
    state.keys.bind('tab', block)
    state.keys.bind('shift+tab', block)
    state.keys.bind('backspace', log)
    state.keys.bind('del', log)
    state.keys.bind('enter', log)
    state.keys.bind('(', withSelection((select, range, startOffset, endOffset) => {
      let update = insert(state.content(), startOffset, '(')
      update = insert(update, endOffset + 1 , ')')
      state.content(update)
      dom.textContent = state.content()

      setSelection(dom.firstChild, startOffset + 1, endOffset + 1)
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
    return m('code.combokeys', {
      contenteditable : true,
      oninput : m.withAttr('textContent', state.content),
    })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild.focus() } }, m(code))
}

m.render(document.body, m(editor))
