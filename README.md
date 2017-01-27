# misbehave
> Add IDE-like text entry to HTML contenteditable tags

`misbehave` is a small library for adding IDE-like text entry to HTML `contenteditable` tags, inspired by [behave.js](https://github.com/iamso/Behave.js). When you need something, but [Ace Editor](https://github.com/ajaxorg/ace) and [CodeMirror](https://github.com/codemirror/CodeMirror) seem large (they're probably more robust, so pick your poison).

`misbehave` is modular and contains string utils that should be re-usable if you need to implement f.e. auto-indent in an IDE-like way in javascript. [Check the utils README](utils/README.md) for details. The indentation behaviour for `misbehave` is currently hardcoded for javascript code entry, and may not perform to expectations if used for other languages.

- [Live demo on GH pages](https://orbitbot.github.io/misbehave/)
- [Live demo with javascript syntax highlighting](https://orbitbot.github.io/misbehave/prismjs.html) using [Prism.js](http://prismjs.com/)

<br>

**Experimental**

Misbehave has not gone through exhaustive testing, so buyer beware. `#worksforme` - do post issues and fixes if you run into problems or unexpected behaviour, however.

<br>

### Features

| feature    | description                                                                                        | misbehave             | behave.js                              |
|:-----------|:---------------------------------------------------------------------------------------------------|:---------------------:|:--------------------------------------:|
| undo/redo  | press common keyboard combinations (ctrl-z, ctrl-shift-z) to undo and redo edits                   | custom implementation | uses browser functionality, has issues |
| autoIndent | indent to previous line start by default, `()` and `{}` has special functionality                  | `Y`                   | `Y`                                    |
| autoOpen   | if any of `({['"` are typed, their counterparts will also be added                                 | `Y`                   | `Y`                                    |
| autoStrip  | if your cursor is between two paired characters, backspace will delete both                        | `Y`                   | `Y`                                    |
| overwrite  | if you type a closing character directly before an identical one, it will overwrite instead of add | `Y`                   | `Y`                                    |
| replaceTab | tab key indents instead of cycles focus, shift de-indents, similarly for multiline selections      | `Y`                   | `Y`                                    |
| softTabs   | use spaces instead of tab characters                                                               | `Y`                   | `Y`                                    |
| code fence | exclude areas from editing functionality with magic string                                         | `N/A`                 | `Y`                                    |

- `misbehave`'s undo/redo is a naive implementation where each input is individually undoable and doesn't handle restoring selection perfectly. Undo history is also unlimited, which therefore might cause memory issues over time
- `misbehave` works on `contenteditable` HTML tags, whereas `behave.js` is implemented for textareas

<br>

<!-- installation -->
<!-- Usage -->
<!-- ... oninput -->
<!-- Usage with Prism.js -->

<br>

### Roadmap

- configurable undo limit (pass param in constructor)
- configurable string utils -> language implementations
  ->
- configurable store (?)
-

### License

`misbehave` is MIT licensed.
