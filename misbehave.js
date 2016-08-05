import m from 'mithril'

let code = {

  oninit : ({ state }) => {
    window.content = state.content = m.prop('')
    state.content.map((x) => console.log(x))
    state.logKeypress = (evt) => {
      var charCode = evt.which || evt.keyCode;
      var charTyped = String.fromCharCode(charCode);
      console.log(charTyped)
    }
  },

  // oncreate : ({ state, dom }) => {asa
  //   console.log(dom.querySelector('#editor'))
  // },

  view : ({ state }) => {
    return m('code#editor', {
      contenteditable : true,
      onkeypress : state.logKeypress,
      oninput : m.withAttr('textContent', state.content),
      textContent : state.content()
    })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild.focus() } }, m(code))
}

m.render(document.body, m(editor))
