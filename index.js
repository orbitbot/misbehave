'use strict';

import Editable from './editable'
import store from './utils/store'
import { getSections } from './utils/selection'
import js from './behaviors/javascript'


export default class Misbehave extends Editable {
  constructor(elem, opts = {}) {
    if (typeof opts.store === 'undefined') opts.store = store(getSections(elem))
    if (typeof opts.behavior === 'undefined') opts.behavior = js

    super(elem, opts)
  }
}
