import m from 'mithril'
import Combokeys from 'combokeys'
import UndoManager from 'undo-manager'
import StrUtil from './utils/string'
import { withStartEnd, setSelection } from './utils/selection'
import { nthOccurrance } from './utils/utils'
import store from './utils/store'

let undoMgr = new UndoManager()
let strUtil = new StrUtil('\n', '\t')

const pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"', '"'], ['"', '"']]


let code = {

  oninit : ({ state }) => {
    state.content = store({ prefix: '', selected: '', suffix: '' })
    window.content = state.content

    state.setDom = (value) => {
      state.dom.textContent = value.prefix + value.selected + value.suffix
      setSelection(state.dom, value.prefix.length, value.selected.length)
    }

    // refactor updateDom => function to actually set dom with default noop
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
      state.updateContent(strUtil.tabIndent(prefix, selected, suffix), true)
      return false
    }))

    state.keys.bind('shift+tab', state.extractSections((selection, range, prefix, selected, suffix) => {
      state.updateContent(strUtil.tabUnindent(prefix, selected, suffix), true)
      return false
    }))

    state.keys.bind('backspace', state.extractSections((selection, range, prefix, selected, suffix) => {
      if (selection.isCollapsed && strUtil.testAutoStrip(prefix, selected, suffix)) {
        state.updateContent(strUtils.autoStrip(prefix, selected, suffix), true)
        return false
      }
    }))

    state.keys.bind('enter', state.extractSections((selection, range, prefix, selected, suffix) => {
      state.updateContent(strUtil.autoIndent(prefix, selected, suffix), true)
      return false
    }))

    state.keys.bind('mod+z', () => { undoMgr.undo(); return false })
    state.keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    const autoOpen = (openChar, closeChar) => {
      return state.extractSections((selection, range, prefix, selected, suffix) => {
        state.updateContent(strUtil.autoOpen(openChar, closeChar, prefix, selected, suffix), true)
        return false
      })
    }

    const overwrite = (closeChar) => {
      return state.extractSections((selection, range, prefix, selected, suffix) => {
        if (selection.isCollapsed && strUtil.testOverwrite(closeChar, prefix, selected, suffix)) {
          state.updateContent(strUtil.overwrite(prefix, selected, suffix), true)
          return false
        }
      })
    }

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
