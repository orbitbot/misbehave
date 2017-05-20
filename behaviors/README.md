### Reusing `misbehave`'s string methods for IDE text entry functionality

`misbehave` considers only the plain text of the html tags that it works on, and works based on the idea of the text content split into three parts; `prefix`, `selected` and `suffix`. `selected` is taken to mean the current location of the cursor or whatever part of the text the user has highlighted, with `prefix` and `suffix` being the rest of the text before and after this selection, respectively. With this abstraction, the implementation of common IDE text entry functionality is relatively straightforward. For example, bracket auto open is the simple operation of adding opening and closing bracket characters to the prefix and suffix without changing the selection.

Because of the above, the implementations in `misbehave` can be re-used elsewhere you require similar functionality. The rest of this README outlines the functionality of the provided methods with some examples using the default javascript IDE-like _behavior_. The functionality discussed is implemented in the `behaviors/javascript/index.js` file in this repository.

In the following examples, the characters `>` and `<` are used to indicate the start and end of the selected text, if any, and do not themselves actually count as characters. As an example, in the case of `"demonstration><"` the cursor is directly after the full word with no text highlighted, and with `"plato >units <of bitterness"` the substring `units ` (including the space after the word) is selected. Consequently,

```js
var json = >{
  "dom": "complicated"
}<
```

indicates the multi-line selection of the whole JSON object inside the angle brackets.

### Factory method

A _behavior_  implementation should be a function that returns an object with all the methods defined in the next section (API). The function signature is

```javascript
const behavior = (newline, tablike) => {
  autoIndent : () => { /* ... */},
  ...
}
```

Where `newline` and `tablike` are the appropriate characters or strings defined by the platform and configuration, which should be used as such to implement correct indentation.

<br>

### API

All of the below methods return an object `{ prefix, selected, suffix }`, which represent the parameters modified with the corresponding action. `tab` indicates the tab string to use (eg. `\t` or `"  "` for soft tabs with two spaces), whereas `newLine` should be the newline character(s) to use depending on the target platform (`\n` or `\r\n`).

<br>

**`autoIndent(newLine, tab, prefix, selected, suffix)`**

Automatic indentation is an action typically tied to the enter keypress, the intent being to continue typing at the appropriate indentation level for the current code block. By default, this method will add the same leading whitespace as the previous line:


```
var json = {
  "dom": "complicated",><
}

// input enter ==>

var json = {
  "dom": "complicated",
  ><
}
```

If you have more opening than closing parentheses on the previous line, the indentation will be to the last opening parenthesis, allowing f.e. function parameters to be written vertically:


```
    var myFun = function(first><

// input enter ==>

    var myFun = function(first
                         ><
```

The final functionality provided is typical behaviour for curly braces. If the previous character is an opening curly brace, the next line will be indented to the leading whitespace and the tab character provided, and if there's a closing curly brace this will be placed on its own line indented to the leading whitespace:

```
    function() {><

// input enter ==>

    function() {
        ><

// and

    function() {><}

// input enter ==>

    function() {
        ><
    }
```

<br>

**`autoOpen(opening, closing, prefix, selected, suffix)`**

Automatically matching opening and closing characters is typically implemented for braces and single and double quotes (`([{` and `'"`). Whenever a user types one of the opening characters the closing character will be added to the text after the selection, both without and with selected text:

```
function><

// input ( ==>

function(><)

// and

var quote = >inconceivable<

// input " ==>

var quote = ">inconceivable<"
```

<br>

**`autoStrip(prefix, selected, suffix)`**

If a user has the cursor between paired characters (such as the ones discussed in autoOpen), backspace will remove both characters.

```
function(><)

// input backspace ==>

function><
```

<br>

**`testAutoStrip(pairs, prefix, selected, suffix)`**

Returns `true` if prefix and suffix start with a matching character pair, `false otherwise. Valid character pairs are defined by the `pairs` parameter, which should be an array containing arrays of valid opening and closing characters. The outer array can also contain single element arrays when a matching pair is formed by identical characters.

The default pairs are defined as

```
pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"'], ["'"]]
```

<br>

**`overwrite(closing, prefix, selected, suffix)`**

If a closing character is typed directly before an identical character, overwrite the character instead of adding a new one.

```
function(><)

// input ) ==>

function()><
```

<br>

**`testOverwrite(closing, prefix, selected, suffix)`**

Returns `true` if the suffix starts with the parameter closing characer, `false` otherwise.

<br>

**`tabIndent(newLine, tab, prefix, selected, suffix)`**

Code indentation is used for alignment and maintaining readable code, tab indent will add soft or hard tabs depending on the selection. If no text is selected, the cursor will be indented to the next even tab. If multiple lines are selected, a tab will be added to the start of the selected lines.

```
    function()><

// input tab ==>

    function()  ><

// and

    >function() {
        return 42
    }<

// input tab ==>

        >function() {
            return 42
        }<

```

<br>

**`tabUnindent(newLine, tab, prefix, selected, suffix)`**

Removes tab-like characters based on the selection. If the selection is on a single line and the prefix string before the selection ends with a tab-like, the tab is removed, otherwise the selection will be tab-*indented* instead. If multiple lines are selected, one tab-like will be removed from the start of all lines selected, including the line where the selection starts.


```
    function()  ><

// input shift + tab ==>

    function()><

// and

        >function() {
            return 42
        }<

// input shift + tab ==>

    >function() {
        return 42
    }<

// but indents if there is no tab before selection

    fun><ction

// input shift + tab ==>

    fun ><ction

```
