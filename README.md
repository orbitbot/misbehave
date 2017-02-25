# misbehave
> Add IDE-like text entry to HTML contenteditable tags

`misbehave` is a small library (~ 11KB min+gz) for adding IDE-like text entry to HTML `contenteditable` tags, inspired by [behave.js](https://github.com/iamso/Behave.js). When you need something, but [Ace Editor](https://github.com/ajaxorg/ace) and [CodeMirror](https://github.com/codemirror/CodeMirror) seem large (they're probably more robust and feature-packed, so pick your poison).

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

`misbehave` supports common IDE-like keypress behavior (f.e. auto indentation, automatically matching opening brackets etc.), undo and redo, is flexibly configurable, and can support dynamic syntax highlighting together with external tools.

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

- `misbehave`'s undo/redo is a naive implementation where each input is individually undoable and doesn't always handle restoring selection perfectly. By default, undo/redo history is also unlimited, which might cause memory issues over time in constrained environments
- `misbehave` works on `contenteditable` HTML tags, whereas `behave.js` is implemented for textareas

<br>
### Installation

Right click to save or use the URLs in your script tags

- [`misbehave.js`](https://rawgit.com/orbitbot/misbehave/master/misbehave.js)

or use

```sh
$ npm install misbehave
```

The URL provided above is a uncompressed "development" URL from RawGit, you should at least switch to the "production" URL to ensure that you're getting a known version and don't have issues with traffic limits or throttling if using `misbehave` like this on a more permanent basis.

If you're using `misbehave` directly in a browser environment without a packaging toolchain, the constructor is attached `window.Misbehave`.

<br>
### Usage

The library exposes a `Misbehave` module or browser global, which is a constructor. The constructor expects a `contenteditable` DOM node:

**HTML**
```html
<code id="code"
  contenteditable="true"
  autocorrect="off"
  autocapitalize="off"
  spellcheck="false">
</code>
```

**Javascript**
```js
let editoresque = new Misbehave(document.querySelector('#code'))
```

`misbehave` will then process events on the `<code>` element only. The other attributes specified in HTML are there to remove default browser functionality that may be distracting when entering source code instead of regular text.

<br>
### API

For the purpose of this section, let's assign the variable `misbehave` the result of calling the constructor without custom configuration.

##### Constructor

**`new Misbehave(element, options) ⇒ misbehave instance`**

Provide a `contenteditable` DOM node to the constructor as in [the Usage example](#usage) above. Options, their meaning and the defaults are show in [Options and defaults](#options-and-defaults). The options parameter is not required. The constructor does not set the `contenteditable` or any of the other attributes in the example. The DOM node is exposed as `misbehave.elem` for convenience.


<br>
##### Methods

**`misbehave.destroy() ⇒ undefined`**

Remove all event listeners from `misbehave.elem` and delete the undo/redo history. Used to clean up if custom text entry functionality is no longer required. As with the constructor, does not remove `contenteditable` or any other HTML attributes.

**`misbehave.focus() ⇒ undefined`**

Convenience method to focus `misbehave.elem`.

**`misbehave.blur() ⇒ undefined`**

Convenience method to call blur on `misbehave.elem`.

<br>
##### Options and defaults

The second parameter to the `Misbehave` constructor is an optional configuration object. The possible fields and their defaults are

```
{ autoIndent = true,
  autoOpen   = true,
  autoStrip  = true,
  overwrite  = true,
  softTabs   = 2,
  replaceTab = true,
  pairs      = [['(', ')'], ['[', ']'], ['{', '}'], ['"'], ["'"]],
  oninput    = () => {},
  undoLimit  = 0,
  behavior   = 'behaviors/javascript/index.js',
  store      = 'utils/store.js',
}
```

The functionality of `autoIndent`, `autoOpen`, `autoStrip`, `overwrite`, `softTabs` and `replaceTab` are as described in [Comparison with behave.js](#comparison-with-behavejs). The CSS [`tab-size` property](https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size) can be used to set the desired tab width if the `softTabs` option is set to `false`.

**`pairs`** is an array containing nested arrays of `[<opening>, <closing>]` character pairs that the `autoOpen`, `autoStrip` and `overwrite` options apply to. If a "pair" consists of identical characters, such as quotation marks `"`, an array with a single element is sufficient. As an example, if you would like to define `*`, and `<` and `>` as special characters, pass `[['<', '>'], ['*']]` as the `pairs` option.

**`oninput`** is a callback fired whenever there the user edits content in `misbehave.elem`. The signature is

```js
const onInput = (textContent, { prefix, selected, suffix }) => { /* ... */ }
```

The return value of `oninput` is ignored. The second parameter is a reference to the internal variable used by `misbehave` and should be considered read-only to avoid unwanted side effects.

**`undoLimit`** is passed directly to [Undo Manager](https://github.com/ArthurClemens/Javascript-Undo-Manager) and sets the number of undo / redo steps that are maintained by `misbehave`. Note that each keystroke is individually undoable, so especially low limits should probably be avoided. The default is 0, which means unlimited history.

**`behavior`** is explained [the behaviors README](behaviors/README.md), and is the way to f.e. configure Python text entry functionality for `misbehave`.

**`store`** is discussed in [Store API](#store-api).

<br>
##### Fields

These fields are mainly used internally and are exposed to potentially enable advanced use patterns if required.

| field                         | type     | description                                                                                                                                 |
|:------------------------------|:---------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| **`misbehave.elem`**          | DOM node | A reference to the DOM element passed in the constructor                                                                                    |
| **`misbehave.handler`**       | function | A reference to the [_behavior_](behaviors/README.md) definition used to handle custom text entry functionality in the DOM node              |
| **`misbehave.inputListener`** | function | An event handler attached to the `input` DOM event of `misbehave.elem`, used to keep the instance in sync with the content and for cleanup  |
| **`misbehave.keys`**          | module   | The [Combokeys](https://github.com/avocode/combokeys) instance used to provide key bindings for `misbehave`                                 |
| **`misbehave.store`**         | function | Used to store a reference to the current content and selection for `misbehave.elem`                                                         |
| **`misbehave.setDom`**        | function | Used internally to set the `textContent` and [Selection](https://developer.mozilla.org/en-US/docs/Web/API/Selection) of `misbehave.element` |
| **`misbehave.undoMgr`**       | module   | The [Undo Manager](https://github.com/ArthurClemens/Javascript-Undo-Manager) used to provide undo / redo functionality                      |
| **`misbehave.update`**        | function | Used internally to add undo / redo actions, update the store and set the DOM as the end user edits text content                             |

<br>
### Usage with Prism.js

[Prism.js](http://prismjs.com/) is a syntax highlighter for webpages that can be configured to work with `misbehave`. Prism.js CSS [enforces using `<code>` elements for syntax highlighting](http://prismjs.com/#features-full), which you probably want to place inside `<pre>` elements if you are going to use `misbehave`. Configure Prism.js to highlight the code in `misbehave`'s `oninput` callback:

```js
var code = document.querySelector('#code')
var misbehave = new Misbehave(code, {
  oninput : () => Prism.highlightElement(code)
})
```

An example with the Okaida theme is [available on GH pages](https://orbitbot.github.io/misbehave/prismjs.html), the example source is under `docs/`.

<br>
### Custom builds

The [default build](index.js) of `misbehave` is configured as a small extension to the internal [`Editable` class](editable.js). The API for this class is essentially the same as defined above, but the `store` and `behavior` options do not have defaults and need to be provided. The intent with enabling custom builds is to potentially shave some bits by leaving out the default javascript behavior and to use some other `store` implementation such as [flyd streams](https://github.com/paldepind/flyd) to observe changing data, for example.

##### Behavior API

The `behavior` parameter in the configuration options is expected to expose the methods detailed in [the behaviors README](behaviors/README.md) with that exact API. The existing implementation(s) and tests can be used as a reference.

If you define some custom text entry behaviors for javascript or other languages, please make a pull request with the functionality placed in an appropriate subfolder to `behaviors/` so other users can make use of it as well!

##### Store API

The `store` parameter is a "getter-setter" function, which is called whenever the content of `misbehave.elem` changes by end user action. A getter-setter function is defined as a function that will return its current value when called without parameters, and updates the stored value when called with parameters. The first parameter is stored any any further parameters are ignored.

```javascript
let fn = getterSetter

fn()  // returns undefined

fn(4) // returns 4

fn()  // now returns 4
```

`misbehave` will call the `store` function with a `{ prefix, selected, suffix }` object as used internally and described in [the behaviors README](behaviors/README.md).

<br>
### License

`misbehave` is MIT licensed.
