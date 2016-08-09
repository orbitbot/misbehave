// import m from 'mithril'
// import Misbehave from 'misbehave'

let code = {
  oncreate : ({ state, dom }) => {
    state.misbehave = new Misbehave(dom)
  },

  onremove : ({ state }) => {
    state.misbehave.destroy()
  },

  view : ({ state, dom }) => {
    return m('code', { contenteditable : true })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild && e.target.firstChild.focus(); return false } }, m(code))
}

m.render(document.body, m(editor))
