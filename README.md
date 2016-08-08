# misbehave
> Explorations in replicating [behave.js](https://github.com/iamso/Behave.js) in a contenteditable code block

<br>

**Experimental, contributions welcome**

Currently, this is implemented using the [Mithril.js](https://github.com/lhorie/mithril.js) rewrite for convenience, but if this approach matures it will probably be refactored to be framework agnostic.


<br>

### Roadmap / features / ideas

- **project size** : keep as small as possible, keeping below functionality in mind
  - avoid behemoth dependencies like [Rangy](https://github.com/timdown/rangy), for more advanced purposes the [Ace Editor](https://github.com/ajaxorg/ace) and [CodeMirror](https://github.com/codemirror/CodeMirror) already exist
- **undo/redo** : probably using https://github.com/ArthurClemens/Javascript-Undo-Manager or similar
  - hijack typical undo/redo key combinations and repopulate content as appropriate
- **syntax highlighting** : support [http://prismjs.com/](http://prismjs.com/) in `<pre><code contenteditable></code></pre>` blocks

<br>

**behave.js functionality**

- **replaceTab**
  - Pressing the tab key will insert a tab instead of cycle input focus.
  - If you are holding shift, and there is a full tab before your cursor (whatever your tab may be), it will unindent.
  - If you have a range selected, both of the above rules will apply to all lines selected (multi-line indent/unindent)
- **softTabs** : If set to true, spaces will be used instead of a tab character
- **tabSize** : If softTabs is set to true, the number of spaces used is defined here. If set to false, the CSS property tab-size will be used to define hard tab sizes.
- **autoOpen** : If any of the following characters are typed, their counterparts are automatically added:
  - `(` adds `()`
  - `{` adds `{}`
  - `[` adds `[]`
  - `"` adds `""`
  - `'` adds `''`
- **overwrite** : If you type a closing character directly before an identical character, it will overwrite it instead of adding it. Best used with autoOpen set to true
- **autoStrip** : If set to true, and your cursor is between two paired characters, pressing backspace will delete both instead of just the first
- **autoIndent** : If set to true, automatic indentation of your code will be attempted. Best used with autoOpen set to true

<br>

### Basic support for

- [x] undo/redo (naive, each input is new action and doesn't handle restoring selection perfectly)
- [ ] replaceTab
  - [x] insert tab instead of cycle focus
  - [ ] de-indent with shift-tab (subl does tab indent if no range selected)
  - [ ] multi-line support
- [ ] softTabs
- [ ] tabSize
- [x] autoOpen
- [ ] overwrite
- [ ] autoStrip
- [ ] autoIndent
