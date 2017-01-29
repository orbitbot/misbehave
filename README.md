# misbehave
> Add IDE-like text entry to HTML contenteditable tags

`misbehave` is a small library for adding IDE-like text entry to HTML `contenteditable` tags, inspired by [behave.js](https://github.com/iamso/Behave.js). When you need something, but [Ace Editor](https://github.com/ajaxorg/ace) and [CodeMirror](https://github.com/codemirror/CodeMirror) seem large (they're probably more robust, so pick your poison).

`misbehave` is modular and contains string utils that should be re-usable if you need to implement f.e. auto-indent in an IDE-like way. Text entry _"behavior"_ is configurable in `misbehave`, the default build supports javascript text entry based on functionality from Sublime Text 3. [Check the behaviors README](behaviors/README.md) for details and the subfolders under `behaviors/` for implementations.

<br>

**Experimental-ish**

Misbehave has not gone through exhaustive send-this-ship-to-the-moon production level testing, more sort of manually by amenable code-monkeys. `#worksforme` - do post issues and fixes if you run into problems or unexpected behaviour, however.

<br>
### Demo

- [Live demo on GH pages](https://orbitbot.github.io/misbehave/)
- [Live demo with javascript syntax highlighting](https://orbitbot.github.io/misbehave/prismjs.html) using [Prism.js](http://prismjs.com/)

<br>
### Features


##### Comparison with behave.js

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

- `misbehave`'s undo/redo is a naive implementation where each input is individually undoable and doesn't handle restoring selection perfectly. By default, undo/redo history is also unlimited, which therefore might cause memory issues over time in constrained environments
- `misbehave` works on `contenteditable` HTML tags, whereas `behave.js` is implemented for textareas

<br>
### Installation

Right click to save or use the URLs in your script tags

- [`misbehave.js`](https://rawgit.com/orbitbot/misbehave/master/misbehave.js)

or use

```sh
$ npm install pastafarian
```

The URL provided above is a "development" URL from RawGit, you should switch to the "production" URL to ensure that you're getting a known version and don't have issues with traffic limits or throttling if using `misbehave` like this on a more permanent basis.

If you're using `misbehave` directly in a browser environment without a packaging toolchain, the constructor is attached to the `Misbehave` global.

<!-- Usage -->
<!-- ... oninput -->

<!-- Custom builds -->

<br>
### Usage with Prism.js

[Prism.js](http://prismjs.com/) is a syntax highlighter for webpages that can be configured to work with `misbehave`. Prism.js CSS [enforces using `<code>` elements for syntax highlighting](http://prismjs.com/#features-full), which you probably want to place inside `<pre>` elements if you are going to use `misbehave`. Configure Prism.js to highlight the code in `misbehave`'s `oninput` callback:

```js
var code = document.querySelector('#code')
var misbehave = new Misbehave(code, {
  oninput : () => Prism.highlightElement(code)
})
```

An example with the Okaida theme is [available on GH pages](https://orbitbot.github.io/misbehave/prismjs.html), the source code is in the `docs/` folder.

<br>
### License

`misbehave` is MIT licensed.
