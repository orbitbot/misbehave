### Reusing `misbehave`'s string methods for IDE text entry functionality

`misbehave` considers only the plain text of the html tags that it works on, and works based on the idea of the text content split into three parts; `prefix`, `selected` and `suffix`. `selected` is taken to mean the current location of the cursor or whatever part of the text the user has highlighted, with `prefix` and `suffix` being the rest of the text before and after this selection, respectively. With this abstraction, the implementation of common IDE text entry functionality is relatively straightforward. For example, bracket auto open is the simple operation of adding opening and closing bracket characters to the prefix and suffix without changing the selection.

Because of the above, the implementations in `misbehave` can be re-used elsewhere you require similar functionality in javascript. The rest of this README outlines the functionality of the provided methods with some examples.

In the following examples, the characters `>` and `<` are used to indicate the start and end of the selected text, if any. As an example, in the case of `"demonstration><"` the cursor is directly after the full word with no text highlighted, and with `"plato >units <of bitterness"` the substring `units ` (including the space after the word) is selected. Consequently,

```js
var json = >{
  "dom": "complicated"
}<
```

indicates the multi-line selection of the whole JSON object inside the angle brackets.

<br>

### API

All of the below methods return an object `{ prefix, selected, suffix }`, which represent the parameters modified with the corresponding action. `tab` indicates the tab string to use (eg. `\t` or `"  "` for soft tabs with two spaces), whereas `newLine` should be the newline character(s) to use depending on the target platform (`\n` or `\r\n`).

<br>

**`autoIndent(newLine, tab, prefix, selected, suffix)`**


**`autoOpen(opening, closing, prefix, selected, suffix)`**


**`autoStrip(prefix, selected, suffix)`**


**`testAutoStrip(pairs, prefix, selected, suffix)`**


**`overwrite(closing, prefix, selected, suffix)`**


**`testOverwrite(closing, prefix, selected, suffix)`**


**`tabIndent(newLine, tab, prefix, selected, suffix)`**


**`tabUnindent(newLine, tab, prefix, selected, suffix)`**

