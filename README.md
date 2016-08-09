# misbehave
> Add IDE-like text entry to HTML contenteditable tags

`misbehave` is a small library for adding IDE-like text entry to HTML `contenteditable` tags, inspired by [behave.js](https://github.com/iamso/Behave.js). When you need something, but [Ace Editor](https://github.com/ajaxorg/ace) and [CodeMirror](https://github.com/codemirror/CodeMirror) seem large (they're probably more robust, so pick your poison).

`misbehave` is modular and contains string utils that should be re-usable if you need to implement f.e. auto-indent in an IDE-like way in javascript. [Check the README](utils/README.md) for details.

- [Live demo on GH pages](https://orbitbot.github.io/misbehave/)
- Experimental [live demo with javascript syntax highlighting](https://orbitbot.github.io/misbehave/prismjs.html) using [Prism.js](http://prismjs.com/)

<br>

**Experimental**

Misbehave has not yet gone through robust testing, so buyer beware. `#worksforme` - do post issues and fixes if you run into problems or unexpected behaviour, however.

<br>

### Features

| feature    | description                                                                                        | misbehave             | behave.js                              |
|:-----------|:---------------------------------------------------------------------------------------------------|:---------------------:|:--------------------------------------:|
| undo/redo  | common keyboard combinations for undo and redo                                                     | custom implementation | uses browser functionality, has issues |
| autoIndent | indent to previous line start by default, `()` and `{}` has special functionality                  | `Y`                   | `Y`                                    |
| autoOpen   | if any of `({['"` are typed, their counterparts will also be added                                 | `Y`                   | `Y`                                    |
| autoStrip  | if your cursor is between two paired characters, backspace will delete both                        | `Y`                   | `Y`                                    |
| overwrite  | if you type a closing character directly before an identical one, it will overwrite instead of add | `Y`                   | `Y`                                    |
| replaceTab | tab key indents instead of cycles focus, shift de-indents, similarly for multiline selections      | `Y`                   | `Y`                                    |
| softTabs   | use spaces instead of tab characters                                                               |                       | `Y`                                    |

- `misbehave`'s undo/redo is a naive implementation where each input is individually undoable and doesn't handle restoring selection perfectly
- `misbehave`'s autoIndent doesn't yet work correct with regard to tabs / soft tabs
- `misbehave` is going to support soft tabs and custom tab width

<br>

<!-- installation -->
<!-- Usage -->
<!-- Usage with Prism.js -->

<br>

### License

`misbehave` is MIT licensed.
