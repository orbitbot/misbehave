'use strict';

export default function store(value) {
  function gettersetter() {
    if (arguments.length) {
      value = arguments[0]
    }
    return value
  }
  return gettersetter
}
