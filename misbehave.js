import m from 'mithril'

let code = {

  oncreate : ({ state, dom }) => {
    state.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        var message = "";
        switch (mutation.type) {
            case 'characterData':
                message = "Character data changed from '" + mutation.oldValue +
                    "' to '" + mutation.target.data + "'";
                break;
            case 'attributes':
                message = "Attribute '" + mutation.attributeName + "' changed from '" + mutation.oldValue +
                    "' to '" + mutation.target.getAttribute(mutation.attributeName) + "'";
                break;
            case 'childList':
                message = "DOM tree changed inside node with name " + mutation.target.nodeName;
                break;
        }
        console.log(message)
      })
    })
    state.observer.observe(dom, {
      subtree: true,
      attributes: true,
      childList: true,
      characterData: true,
      characterDataOldValue: true
    });
  },

  onremove : ({ state }) => {
    state.observer.disconnect()
  },

  view : ({ state }) => {
    return m('code#editor', {
      contenteditable : true,
    })
  }
}

let editor = {
  view : ({ state }) => m('pre', { onclick: (e) => { e.target.firstChild.focus() } }, m(code))
}

m.render(document.body, m(editor))
