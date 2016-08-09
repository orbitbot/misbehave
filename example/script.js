var code = document.querySelector('#code')
var misbehave = new Misbehave(code)

var pre = document.querySelector('#pre')
pre.onclick = function() {
  code.focus()
  return false
}
