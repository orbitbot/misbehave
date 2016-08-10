"use strict"

import Combokeys from 'combokeys'
import UndoManager from 'undo-manager'
import StrUtil from './utils/string'
import { withStartEnd, setSelection } from './utils/selection'
import { defineNewLine, nthOccurrance } from './utils/utils'
import store from './utils/store'


export default class Misbehave {
  constructor(elem, { autoIndent = true,
                      autoOpen = true,
                      autoStrip = true,
                      overwrite = true,
                      softTabs = 2,
                      replaceTab = true,
                      pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"'], ["'"]]
                    } = {}) {

    let misbehave = this
    let newLine = defineNewLine()
    let strUtil = new StrUtil(newLine, softTabs ? ' '.repeat(softTabs) : '\t')

    let undoMgr = new UndoManager()
    let current = store({ prefix: '', selected: '', suffix: '' })

    let setDom = (value) => {
      elem.textContent = value.prefix + value.selected + value.suffix
      setSelection(elem, value.prefix.length, value.selected.length)
    }

    let update = (update, updateDom) => {
      let previous = current()
      undoMgr.add({
        undo : () => { setDom(previous) },
        redo : () => { setDom(update) }
      })
      current(update)
      if (updateDom) setDom(update)
    }

    let extract = (fn) => {
      return withStartEnd((selection, range, startLine, startOffset, endLine, endOffset) => {
        let prefixIndex = nthOccurrance(elem.textContent, newLine, startLine) + startOffset
        let prefix = elem.textContent.slice(0, prefixIndex)
        let selected = range.toString()
        let suffix = elem.textContent.slice(prefixIndex + selected.length)

        console.info('extracted', [prefix, selected, suffix])

        return fn(selection, range, prefix, selected, suffix)
      })
    }

    let keys = new Combokeys(elem)
    keys.stopCallback = () => false // work without needing to set combokeys class on elements

    keys.bind('mod+z', () => { undoMgr.undo(); return false })
    keys.bind('shift+mod+z', () => { undoMgr.redo(); return false })

    if (autoIndent) {
      keys.bind('enter', extract((selection, range, prefix, selected, suffix) => {
        update(strUtil.autoIndent(prefix, selected, suffix), true)
        return false
      }))
    }

    if (autoStrip) {
      keys.bind('backspace', extract((selection, range, prefix, selected, suffix) => {
        if (selection.isCollapsed && strUtil.testAutoStrip(pairs, prefix, selected, suffix)) {
          update(strUtil.autoStrip(prefix, selected, suffix), true)
          return false
        }
      }))
    }

    let fnAutoOpen = (opening, closing) => extract((selection, range, prefix, selected, suffix) => {
      update(strUtil.autoOpen(opening, closing, prefix, selected, suffix), true)
      return false
    })

    let fnOverwrite = (closing) => extract((selection, range, prefix, selected, suffix) => {
      if (selection.isCollapsed && strUtil.testOverwrite(closing, prefix, selected, suffix)) {
        update(strUtil.overwrite(closing, prefix, selected, suffix), true)
        return false
      }
    })

    pairs.forEach(([opening, closing]) => {
      if (closing) {
        if (autoOpen)  keys.bind(opening, fnAutoOpen(opening, closing))
        if (overwrite) keys.bind(closing, fnOverwrite(closing))
      } else {
        if (autoOpen && overwrite) {
          keys.bind(opening, extract((selection, range, prefix, selected, suffix) => {
            if (selection.isCollapsed && strUtil.testOverwrite(opening, prefix, selected, suffix))
              update(strUtil.overwrite(opening, prefix, selected, suffix), true)
            else
              update(strUtil.autoOpen(opening, opening, prefix, selected, suffix), true)
            return false
          }))
        } else {
          if (autoOpen)  keys.bind(opening, fnAutoOpen(opening, opening))
          if (overwrite) keys.bind(opening, fnOverwrite(opening))
        }
      }
    })

    if (replaceTab) {
      keys.bind('tab', extract((selection, range, prefix, selected, suffix) => {
        update(strUtil.tabIndent(prefix, selected, suffix), true)
        return false
      }))

      keys.bind('shift+tab', extract((selection, range, prefix, selected, suffix) => {
        update(strUtil.tabUnindent(prefix, selected, suffix), true)
        return false
      }))
    }

    let inputListener = elem.addEventListener('input', extract((selection, range, prefix, selected, suffix) => {
      update({ prefix, selected, suffix })
    }))

    // expose for haxxoers
    misbehave.__elem = elem
    misbehave.__strUtil = strUtil
    misbehave.__undoMgr = undoMgr
    misbehave.__current = current
    misbehave.__setDom = setDom
    misbehave.__update = update
    misbehave.__extract = extract
    misbehave.__inputListener = inputListener
    misbehave.__keys = keys
  }

  destroy () {
    this.__elem.removeEventListener('input', this.__inputListener)
    this.__keys.destroy()
    this.__undoMgr.clear()
  }
}
