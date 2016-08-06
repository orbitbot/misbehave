import m from 'mithril'
import Combokeys from 'combokeys'

const log = (e, combo) => { console.log(combo) }
const block = (e, combo) => { console.log(combo); return false; }

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
    state.keys.bind('(', () => {
      state.content(state.content() + '()')
      dom.textContent = state.content()
      return false
    })
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
