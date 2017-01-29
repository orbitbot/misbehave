'use strict';

import strUtil from './utils/string'
import store from './utils/store'
import { getSections } from './utils/selection'
import Editable from './editable'


export default class Misbehave extends Editable {
  constructor(elem, opts = {}) {
    if (typeof opts.store === 'undefined') opts.store = store(getSections(elem))
    if (typeof opts.StrUtil === 'undefined') opts.StrUtil = strUtil

    super(elem, opts)
  }
}
