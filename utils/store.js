"use strict"

export default function store(value) {
  function gettersetter() {
    if (arguments.length) {
      value = arguments[0]
      console.log(value)
    }
    return value
  }
  return gettersetter
}
