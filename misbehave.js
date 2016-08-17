var Misbehave = (function () {
	'use strict';

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var bind = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * binds an event to Combokeys
	 *
	 * can be a single key, a combination of keys separated with +,
	 * an array of keys, or a sequence of keys separated by spaces
	 *
	 * be sure to list the modifier keys first to make sure that the
	 * correct key ends up getting bound (the last key in the pattern)
	 *
	 * @param {string|Array} keys
	 * @param {Function} callback
	 * @param {string=} action - "keypress", "keydown", or "keyup"
	 * @returns void
	 */
	module.exports = function (keys, callback, action) {
	  var self = this

	  keys = keys instanceof Array ? keys : [keys]
	  self.bindMultiple(keys, callback, action)
	  return self
	}
	});

	var bind$1 = interopDefault(bind);


	var require$$18 = Object.freeze({
	  default: bind$1
	});

	var bindMultiple = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * binds multiple combinations to the same callback
	 *
	 * @param {Array} combinations
	 * @param {Function} callback
	 * @param {string|undefined} action
	 * @returns void
	 */
	module.exports = function (combinations, callback, action) {
	  var self = this

	  for (var j = 0; j < combinations.length; ++j) {
	    self.bindSingle(combinations[j], callback, action)
	  }
	}
	});

	var bindMultiple$1 = interopDefault(bindMultiple);


	var require$$17 = Object.freeze({
	  default: bindMultiple$1
	});

	var unbind = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * unbinds an event to Combokeys
	 *
	 * the unbinding sets the callback function of the specified key combo
	 * to an empty function and deletes the corresponding key in the
	 * directMap dict.
	 *
	 * TODO: actually remove this from the callbacks dictionary instead
	 * of binding an empty function
	 *
	 * the keycombo+action has to be exactly the same as
	 * it was defined in the bind method
	 *
	 * @param {string|Array} keys
	 * @param {string} action
	 * @returns void
	 */
	module.exports = function (keys, action) {
	  var self = this

	  return self.bind(keys, function () {}, action)
	}
	});

	var unbind$1 = interopDefault(unbind);


	var require$$16 = Object.freeze({
	  default: unbind$1
	});

	var trigger = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * triggers an event that has already been bound
	 *
	 * @param {string} keys
	 * @param {string=} action
	 * @returns void
	 */
	module.exports = function (keys, action) {
	  var self = this
	  if (self.directMap[keys + ':' + action]) {
	    self.directMap[keys + ':' + action]({}, keys)
	  }
	  return this
	}
	});

	var trigger$1 = interopDefault(trigger);


	var require$$15 = Object.freeze({
	  default: trigger$1
	});

	var reset$1 = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * resets the library back to its initial state. This is useful
	 * if you want to clear out the current keyboard shortcuts and bind
	 * new ones - for example if you switch to another page
	 *
	 * @returns void
	 */
	module.exports = function () {
	  var self = this
	  self.callbacks = {}
	  self.directMap = {}
	  return this
	}
	});

	var reset$2 = interopDefault(reset$1);


	var require$$14 = Object.freeze({
	  default: reset$2
	});

	var stopCallback = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	* should we stop this event before firing off callbacks
	*
	* @param {Event} e
	* @param {Element} element
	* @return {boolean}
	*/
	module.exports = function (e, element) {
	  // if the element has the class "combokeys" then no need to stop
	  if ((' ' + element.className + ' ').indexOf(' combokeys ') > -1) {
	    return false
	  }

	  var tagName = element.tagName.toLowerCase()

	  // stop for input, select, and textarea
	  return tagName === 'input' || tagName === 'select' || tagName === 'textarea' || element.isContentEditable
	}
	});

	var stopCallback$1 = interopDefault(stopCallback);


	var require$$13 = Object.freeze({
	  default: stopCallback$1
	});

	var isModifier = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * determines if the keycode specified is a modifier key or not
	 *
	 * @param {string} key
	 * @returns {boolean}
	 */
	module.exports = function (key) {
	  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta'
	}
	});

	var isModifier$1 = interopDefault(isModifier);


	var require$$1 = Object.freeze({
	  default: isModifier$1
	});

	var handleKey = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * handles a character key event
	 *
	 * @param {string} character
	 * @param {Array} modifiers
	 * @param {Event} e
	 * @returns void
	 */
	module.exports = function (character, modifiers, e) {
	  var self = this
	  var callbacks
	  var j
	  var doNotReset = {}
	  var maxLevel = 0
	  var processedSequenceCallback = false
	  var isModifier
	  var ignoreThisKeypress

	  callbacks = self.getMatches(character, modifiers, e)
	  // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
	  for (j = 0; j < callbacks.length; ++j) {
	    if (callbacks[j].seq) {
	      maxLevel = Math.max(maxLevel, callbacks[j].level)
	    }
	  }

	  // loop through matching callbacks for this key event
	  for (j = 0; j < callbacks.length; ++j) {
	    // fire for all sequence callbacks
	    // this is because if for example you have multiple sequences
	    // bound such as "g i" and "g t" they both need to fire the
	    // callback for matching g cause otherwise you can only ever
	    // match the first one
	    if (callbacks[j].seq) {
	      // only fire callbacks for the maxLevel to prevent
	      // subsequences from also firing
	      //
	      // for example 'a option b' should not cause 'option b' to fire
	      // even though 'option b' is part of the other sequence
	      //
	      // any sequences that do not match here will be discarded
	      // below by the resetSequences call
	      if (callbacks[j].level !== maxLevel) {
	        continue
	      }

	      processedSequenceCallback = true

	      // keep a list of which sequences were matches for later
	      doNotReset[callbacks[j].seq] = 1
	      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo, callbacks[j].seq)
	      continue
	    }

	    // if there were no sequence matches but we are still here
	    // that means this is a regular match so we should fire that
	    if (!processedSequenceCallback) {
	      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo)
	    }
	  }

	  // if the key you pressed matches the type of sequence without
	  // being a modifier (ie "keyup" or "keypress") then we should
	  // reset all sequences that were not matched by this event
	  //
	  // this is so, for example, if you have the sequence "h a t" and you
	  // type "h e a r t" it does not match.  in this case the "e" will
	  // cause the sequence to reset
	  //
	  // modifier keys are ignored because you can have a sequence
	  // that contains modifiers such as "enter ctrl+space" and in most
	  // cases the modifier key will be pressed before the next key
	  //
	  // also if you have a sequence such as "ctrl+b a" then pressing the
	  // "b" key will trigger a "keypress" and a "keydown"
	  //
	  // the "keydown" is expected when there is a modifier, but the
	  // "keypress" ends up matching the nextExpectedAction since it occurs
	  // after and that causes the sequence to reset
	  //
	  // we ignore keypresses in a sequence that directly follow a keydown
	  // for the same character
	  ignoreThisKeypress = e.type === 'keypress' && self.ignoreNextKeypress
	  isModifier = interopDefault(require$$1)
	  if (e.type === self.nextExpectedAction && !isModifier(character) && !ignoreThisKeypress) {
	    self.resetSequences(doNotReset)
	  }

	  self.ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown'
	}
	});

	var handleKey$1 = interopDefault(handleKey);


	var require$$12 = Object.freeze({
	  default: handleKey$1
	});

	var domEvent = createCommonjsModule(function (module) {
	module.exports = on
	module.exports.on = on
	module.exports.off = off

	function on (element, event, callback, capture) {
	  !element.addEventListener && (event = 'on' + event)
	  ;(element.addEventListener || element.attachEvent).call(element, event, callback, capture)
	  return callback
	}

	function off (element, event, callback, capture) {
	  !element.removeEventListener && (event = 'on' + event)
	  ;(element.removeEventListener || element.detachEvent).call(element, event, callback, capture)
	  return callback
	}
	});

	var domEvent$1 = interopDefault(domEvent);
	var off = domEvent.off;
	var on = domEvent.on;

var require$$0 = Object.freeze({
	  default: domEvent$1,
	  off: off,
	  on: on
	});

	var specialKeysMap = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * mapping of special keycodes to their corresponding keys
	 *
	 * everything in this dictionary cannot use keypress events
	 * so it has to be here to map to the correct keycodes for
	 * keyup/keydown events
	 *
	 * @type {Object}
	 */
	module.exports = {
	  8: 'backspace',
	  9: 'tab',
	  13: 'enter',
	  16: 'shift',
	  17: 'ctrl',
	  18: 'alt',
	  20: 'capslock',
	  27: 'esc',
	  32: 'space',
	  33: 'pageup',
	  34: 'pagedown',
	  35: 'end',
	  36: 'home',
	  37: 'left',
	  38: 'up',
	  39: 'right',
	  40: 'down',
	  45: 'ins',
	  46: 'del',
	  91: 'meta',
	  93: 'meta',
	  187: 'plus',
	  189: 'minus',
	  224: 'meta'
	}

	/**
	 * loop through the f keys, f1 to f19 and add them to the map
	 * programatically
	 */
	for (var i = 1; i < 20; ++i) {
	  module.exports[111 + i] = 'f' + i
	}

	/**
	 * loop through to map numbers on the numeric keypad
	 */
	for (i = 0; i <= 9; ++i) {
	  module.exports[i + 96] = i
	}
	});

	var specialKeysMap$1 = interopDefault(specialKeysMap);


	var require$$0$3 = Object.freeze({
	  default: specialKeysMap$1
	});

	var specialCharactersMap = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * mapping for special characters so they can support
	 *
	 * this dictionary is only used incase you want to bind a
	 * keyup or keydown event to one of these keys
	 *
	 * @type {Object}
	 */
	module.exports = {
	  106: '*',
	  107: '+',
	  109: '-',
	  110: '.',
	  111: '/',
	  186: ';',
	  187: '=',
	  188: ',',
	  189: '-',
	  190: '.',
	  191: '/',
	  192: '`',
	  219: '[',
	  220: '\\',
	  221: ']',
	  222: "'"
	}
	});

	var specialCharactersMap$1 = interopDefault(specialCharactersMap);


	var require$$0$4 = Object.freeze({
	  default: specialCharactersMap$1
	});

	var characterFromEvent = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * takes the event and returns the key character
	 *
	 * @param {Event} e
	 * @return {string}
	 */
	module.exports = function (e) {
	  var SPECIAL_KEYS_MAP,
	    SPECIAL_CHARACTERS_MAP
	  SPECIAL_KEYS_MAP = interopDefault(require$$0$3)
	  SPECIAL_CHARACTERS_MAP = interopDefault(require$$0$4)

	  // for keypress events we should return the character as is
	  if (e.type === 'keypress') {
	    var character = String.fromCharCode(e.which)

	    // if the shift key is not pressed then it is safe to assume
	    // that we want the character to be lowercase.  this means if
	    // you accidentally have caps lock on then your key bindings
	    // will continue to work
	    //
	    // the only side effect that might not be desired is if you
	    // bind something like 'A' cause you want to trigger an
	    // event when capital A is pressed caps lock will no longer
	    // trigger the event.  shift+a will though.
	    if (!e.shiftKey) {
	      character = character.toLowerCase()
	    }

	    return character
	  }

	  // for non keypress events the special maps are needed
	  if (SPECIAL_KEYS_MAP[e.which]) {
	    return SPECIAL_KEYS_MAP[e.which]
	  }

	  if (SPECIAL_CHARACTERS_MAP[e.which]) {
	    return SPECIAL_CHARACTERS_MAP[e.which]
	  }

	  // if it is not in the special map

	  // with keydown and keyup events the character seems to always
	  // come in as an uppercase character whether you are pressing shift
	  // or not.  we should make sure it is always lowercase for comparisons
	  return String.fromCharCode(e.which).toLowerCase()
	}
	});

	var characterFromEvent$1 = interopDefault(characterFromEvent);


	var require$$0$2 = Object.freeze({
	  default: characterFromEvent$1
	});

	var eventModifiers = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * takes a key event and figures out what the modifiers are
	 *
	 * @param {Event} e
	 * @returns {Array}
	 */
	module.exports = function (e) {
	  var modifiers = []

	  if (e.shiftKey) {
	    modifiers.push('shift')
	  }

	  if (e.altKey) {
	    modifiers.push('alt')
	  }

	  if (e.ctrlKey) {
	    modifiers.push('ctrl')
	  }

	  if (e.metaKey) {
	    modifiers.push('meta')
	  }

	  return modifiers
	}
	});

	var eventModifiers$1 = interopDefault(eventModifiers);


	var require$$0$5 = Object.freeze({
	  default: eventModifiers$1
	});

	var handleKeyEvent = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * handles a keydown event
	 *
	 * @param {Event} e
	 * @returns void
	 */
	module.exports = function (e) {
	  var self = this
	  var characterFromEvent
	  var eventModifiers

	  // normalize e.which for key events
	  // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
	  if (typeof e.which !== 'number') {
	    e.which = e.keyCode
	  }
	  characterFromEvent = interopDefault(require$$0$2)
	  var character = characterFromEvent(e)

	  // no character found then stop
	  if (!character) {
	    return
	  }

	  // need to use === for the character check because the character can be 0
	  if (e.type === 'keyup' && self.ignoreNextKeyup === character) {
	    self.ignoreNextKeyup = false
	    return
	  }

	  eventModifiers = interopDefault(require$$0$5)
	  self.handleKey(character, eventModifiers(e), e)
	}
	});

	var handleKeyEvent$1 = interopDefault(handleKeyEvent);


	var require$$0$1 = Object.freeze({
	  default: handleKeyEvent$1
	});

	var addEvents = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	module.exports = function () {
	  var self = this
	  var on = interopDefault(require$$0)
	  var element = self.element

	  self.eventHandler = interopDefault(require$$0$1).bind(self)

	  on(element, 'keypress', self.eventHandler)
	  on(element, 'keydown', self.eventHandler)
	  on(element, 'keyup', self.eventHandler)
	}
	});

	var addEvents$1 = interopDefault(addEvents);


	var require$$11 = Object.freeze({
	  default: addEvents$1
	});

	var bindSingle = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * binds a single keyboard combination
	 *
	 * @param {string} combination
	 * @param {Function} callback
	 * @param {string=} action
	 * @param {string=} sequenceName - name of sequence if part of sequence
	 * @param {number=} level - what part of the sequence the command is
	 * @returns void
	 */
	module.exports = function (combination, callback, action, sequenceName, level) {
	  var self = this

	  // store a direct mapped reference for use with Combokeys.trigger
	  self.directMap[combination + ':' + action] = callback

	  // make sure multiple spaces in a row become a single space
	  combination = combination.replace(/\s+/g, ' ')

	  var sequence = combination.split(' ')
	  var info

	  // if this pattern is a sequence of keys then run through this method
	  // to reprocess each pattern one key at a time
	  if (sequence.length > 1) {
	    self.bindSequence(combination, sequence, callback, action)
	    return
	  }

	  info = self.getKeyInfo(combination, action)

	  // make sure to initialize array if this is the first time
	  // a callback is added for this key
	  self.callbacks[info.key] = self.callbacks[info.key] || []

	  // remove an existing match if there is one
	  self.getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level)

	  // add this call back to the array
	  // if it is a sequence put it at the beginning
	  // if not put it at the end
	  //
	  // this is important because the way these are processed expects
	  // the sequence ones to come first
	  self.callbacks[info.key][sequenceName ? 'unshift' : 'push']({
	    callback: callback,
	    modifiers: info.modifiers,
	    action: info.action,
	    seq: sequenceName,
	    level: level,
	    combo: combination
	  })
	}
	});

	var bindSingle$1 = interopDefault(bindSingle);


	var require$$10 = Object.freeze({
	  default: bindSingle$1
	});

	var keysFromString = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * Converts from a string key combination to an array
	 *
	 * @param  {string} combination like "command+shift+l"
	 * @return {Array}
	 */
	module.exports = function (combination) {
	  if (combination === '+') {
	    return ['+']
	  }

	  return combination.split('+')
	}
	});

	var keysFromString$1 = interopDefault(keysFromString);


	var require$$3 = Object.freeze({
	  default: keysFromString$1
	});

	var specialAliases = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * this is a list of special strings you can use to map
	 * to modifier keys when you specify your keyboard shortcuts
	 *
	 * @type {Object}
	 */
	module.exports = {
	  'option': 'alt',
	  'command': 'meta',
	  'return': 'enter',
	  'escape': 'esc',
	  'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
	}
	});

	var specialAliases$1 = interopDefault(specialAliases);


	var require$$2 = Object.freeze({
	  default: specialAliases$1
	});

	var shiftMap = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * this is a mapping of keys that require shift on a US keypad
	 * back to the non shift equivelents
	 *
	 * this is so you can use keyup events with these keys
	 *
	 * note that this will only work reliably on US keyboards
	 *
	 * @type {Object}
	 */
	module.exports = {
	  '~': '`',
	  '!': '1',
	  '@': '2',
	  '#': '3',
	  '$': '4',
	  '%': '5',
	  '^': '6',
	  '&': '7',
	  '*': '8',
	  '(': '9',
	  ')': '0',
	  '_': '-',
	  '+': '=',
	  ':': ';',
	  '"': "'",
	  '<': ',',
	  '>': '.',
	  '?': '/',
	  '|': '\\'
	}
	});

	var shiftMap$1 = interopDefault(shiftMap);


	var require$$1$1 = Object.freeze({
	  default: shiftMap$1
	});

	var getKeyInfo = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * Gets info for a specific key combination
	 *
	 * @param  {string} combination key combination ("command+s" or "a" or "*")
	 * @param  {string=} action
	 * @returns {Object}
	 */
	module.exports = function (combination, action) {
	  var self = this
	  var keysFromString
	  var keys
	  var key
	  var j
	  var modifiers = []
	  var SPECIAL_ALIASES
	  var SHIFT_MAP
	  var isModifier

	  keysFromString = interopDefault(require$$3)
	  // take the keys from this pattern and figure out what the actual
	  // pattern is all about
	  keys = keysFromString(combination)

	  SPECIAL_ALIASES = interopDefault(require$$2)
	  SHIFT_MAP = interopDefault(require$$1$1)
	  isModifier = interopDefault(require$$1)
	  for (j = 0; j < keys.length; ++j) {
	    key = keys[j]

	    // normalize key names
	    if (SPECIAL_ALIASES[key]) {
	      key = SPECIAL_ALIASES[key]
	    }

	    // if this is not a keypress event then we should
	    // be smart about using shift keys
	    // this will only work for US keyboards however
	    if (action && action !== 'keypress' && SHIFT_MAP[key]) {
	      key = SHIFT_MAP[key]
	      modifiers.push('shift')
	    }

	    // if this key is a modifier then add it to the list of modifiers
	    if (isModifier(key)) {
	      modifiers.push(key)
	    }
	  }

	  // depending on what the key combination is
	  // we will try to pick the best event for it
	  action = self.pickBestAction(key, modifiers, action)

	  return {
	    key: key,
	    modifiers: modifiers,
	    action: action
	  }
	}
	});

	var getKeyInfo$1 = interopDefault(getKeyInfo);


	var require$$9 = Object.freeze({
	  default: getKeyInfo$1
	});

	var pickBestAction = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * picks the best action based on the key combination
	 *
	 * @param {string} key - character for key
	 * @param {Array} modifiers
	 * @param {string=} action passed in
	 */
	module.exports = function (key, modifiers, action) {
	  var self = this

	  // if no action was picked in we should try to pick the one
	  // that we think would work best for this key
	  if (!action) {
	    action = self.getReverseMap()[key] ? 'keydown' : 'keypress'
	  }

	  // modifier keys don't work as expected with keypress,
	  // switch to keydown
	  if (action === 'keypress' && modifiers.length) {
	    action = 'keydown'
	  }

	  return action
	}
	});

	var pickBestAction$1 = interopDefault(pickBestAction);


	var require$$8 = Object.freeze({
	  default: pickBestAction$1
	});

	var getReverseMap = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * reverses the map lookup so that we can look for specific keys
	 * to see what can and can't use keypress
	 *
	 * @return {Object}
	 */
	module.exports = function () {
	  var self = this
	  var constructor = self.constructor
	  var SPECIAL_KEYS_MAP

	  if (!constructor.REVERSE_MAP) {
	    constructor.REVERSE_MAP = {}
	    SPECIAL_KEYS_MAP = interopDefault(require$$0$3)
	    for (var key in SPECIAL_KEYS_MAP) {
	      // pull out the numeric keypad from here cause keypress should
	      // be able to detect the keys from the character
	      if (key > 95 && key < 112) {
	        continue
	      }

	      if (SPECIAL_KEYS_MAP.hasOwnProperty(key)) {
	        constructor.REVERSE_MAP[SPECIAL_KEYS_MAP[key]] = key
	      }
	    }
	  }
	  return constructor.REVERSE_MAP
	}
	});

	var getReverseMap$1 = interopDefault(getReverseMap);


	var require$$7 = Object.freeze({
	  default: getReverseMap$1
	});

	var modifiersMatch = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * checks if two arrays are equal
	 *
	 * @param {Array} modifiers1
	 * @param {Array} modifiers2
	 * @returns {boolean}
	 */
	module.exports = function (modifiers1, modifiers2) {
	  return modifiers1.sort().join(',') === modifiers2.sort().join(',')
	}
	});

	var modifiersMatch$1 = interopDefault(modifiersMatch);


	var require$$0$6 = Object.freeze({
	  default: modifiersMatch$1
	});

	var getMatches = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * finds all callbacks that match based on the keycode, modifiers,
	 * and action
	 *
	 * @param {string} character
	 * @param {Array} modifiers
	 * @param {Event|Object} e
	 * @param {string=} sequenceName - name of the sequence we are looking for
	 * @param {string=} combination
	 * @param {number=} level
	 * @returns {Array}
	 */
	module.exports = function (character, modifiers, e, sequenceName, combination, level) {
	  var self = this
	  var j
	  var callback
	  var matches = []
	  var action = e.type
	  var isModifier
	  var modifiersMatch

	  if (
	      action === 'keypress' &&
	      // Firefox fires keypress for arrows
	      !(e.code && e.code.slice(0, 5) === 'Arrow')
	  ) {
	    // 'any-character' callbacks are only on `keypress`
	    var anyCharCallbacks = self.callbacks['any-character'] || []
	    anyCharCallbacks.forEach(function (callback) {
	      matches.push(callback)
	    })
	  }

	  if (!self.callbacks[character]) { return matches }

	  isModifier = interopDefault(require$$1)
	  // if a modifier key is coming up on its own we should allow it
	  if (action === 'keyup' && isModifier(character)) {
	    modifiers = [character]
	  }

	  // loop through all callbacks for the key that was pressed
	  // and see if any of them match
	  for (j = 0; j < self.callbacks[character].length; ++j) {
	    callback = self.callbacks[character][j]

	    // if a sequence name is not specified, but this is a sequence at
	    // the wrong level then move onto the next match
	    if (!sequenceName && callback.seq && self.sequenceLevels[callback.seq] !== callback.level) {
	      continue
	    }

	    // if the action we are looking for doesn't match the action we got
	    // then we should keep going
	    if (action !== callback.action) {
	      continue
	    }

	    // if this is a keypress event and the meta key and control key
	    // are not pressed that means that we need to only look at the
	    // character, otherwise check the modifiers as well
	    //
	    // chrome will not fire a keypress if meta or control is down
	    // safari will fire a keypress if meta or meta+shift is down
	    // firefox will fire a keypress if meta or control is down
	    modifiersMatch = interopDefault(require$$0$6)
	    if ((action === 'keypress' && !e.metaKey && !e.ctrlKey) || modifiersMatch(modifiers, callback.modifiers)) {
	      // when you bind a combination or sequence a second time it
	      // should overwrite the first one.  if a sequenceName or
	      // combination is specified in this call it does just that
	      //
	      // @todo make deleting its own method?
	      var deleteCombo = !sequenceName && callback.combo === combination
	      var deleteSequence = sequenceName && callback.seq === sequenceName && callback.level === level
	      if (deleteCombo || deleteSequence) {
	        self.callbacks[character].splice(j, 1)
	      }

	      matches.push(callback)
	    }
	  }

	  return matches
	}
	});

	var getMatches$1 = interopDefault(getMatches);


	var require$$6 = Object.freeze({
	  default: getMatches$1
	});

	var resetSequences = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * resets all sequence counters except for the ones passed in
	 *
	 * @param {Object} doNotReset
	 * @returns void
	 */
	module.exports = function (doNotReset) {
	  var self = this

	  doNotReset = doNotReset || {}

	  var activeSequences = false
	  var key

	  for (key in self.sequenceLevels) {
	    if (doNotReset[key]) {
	      activeSequences = true
	      continue
	    }
	    self.sequenceLevels[key] = 0
	  }

	  if (!activeSequences) {
	    self.nextExpectedAction = false
	  }
	}
	});

	var resetSequences$1 = interopDefault(resetSequences);


	var require$$5 = Object.freeze({
	  default: resetSequences$1
	});

	var preventDefault = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * prevents default for this event
	 *
	 * @param {Event} e
	 * @returns void
	 */
	module.exports = function (e) {
	  if (e.preventDefault) {
	    e.preventDefault()
	    return
	  }

	  e.returnValue = false
	}
	});

	var preventDefault$1 = interopDefault(preventDefault);


	var require$$1$2 = Object.freeze({
	  default: preventDefault$1
	});

	var stopPropagation = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * stops propogation for this event
	 *
	 * @param {Event} e
	 * @returns void
	 */
	module.exports = function (e) {
	  if (e.stopPropagation) {
	    e.stopPropagation()
	    return
	  }

	  e.cancelBubble = true
	}
	});

	var stopPropagation$1 = interopDefault(stopPropagation);


	var require$$0$7 = Object.freeze({
	  default: stopPropagation$1
	});

	var fireCallback = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * actually calls the callback function
	 *
	 * if your callback function returns false this will use the jquery
	 * convention - prevent default and stop propogation on the event
	 *
	 * @param {Function} callback
	 * @param {Event} e
	 * @returns void
	 */
	module.exports = function (callback, e, combo, sequence) {
	  var self = this
	  var preventDefault
	  var stopPropagation

	  // if this event should not happen stop here
	  if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
	    return
	  }

	  if (callback(e, combo) === false) {
	    preventDefault = interopDefault(require$$1$2)
	    preventDefault(e)
	    stopPropagation = interopDefault(require$$0$7)
	    stopPropagation(e)
	  }
	}
	});

	var fireCallback$1 = interopDefault(fireCallback);


	var require$$4 = Object.freeze({
	  default: fireCallback$1
	});

	var bindSequence = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	/**
	 * binds a key sequence to an event
	 *
	 * @param {string} combo - combo specified in bind call
	 * @param {Array} keys
	 * @param {Function} callback
	 * @param {string=} action
	 * @returns void
	 */
	module.exports = function (combo, keys, callback, action) {
	  var self = this

	  // start off by adding a sequence level record for this combination
	  // and setting the level to 0
	  self.sequenceLevels[combo] = 0

	  /**
	   * callback to increase the sequence level for this sequence and reset
	   * all other sequences that were active
	   *
	   * @param {string} nextAction
	   * @returns {Function}
	   */
	  function increaseSequence (nextAction) {
	    return function () {
	      self.nextExpectedAction = nextAction
	      ++self.sequenceLevels[combo]
	      self.resetSequenceTimer()
	    }
	  }

	  /**
	   * wraps the specified callback inside of another function in order
	   * to reset all sequence counters as soon as this sequence is done
	   *
	   * @param {Event} e
	   * @returns void
	   */
	  function callbackAndReset (e) {
	    var characterFromEvent
	    self.fireCallback(callback, e, combo)

	    // we should ignore the next key up if the action is key down
	    // or keypress.  this is so if you finish a sequence and
	    // release the key the final key will not trigger a keyup
	    if (action !== 'keyup') {
	      characterFromEvent = interopDefault(require$$0$2)
	      self.ignoreNextKeyup = characterFromEvent(e)
	    }

	    // weird race condition if a sequence ends with the key
	    // another sequence begins with
	    setTimeout(
	      function () {
	        self.resetSequences()
	      },
	      10
	    )
	  }

	  // loop through keys one at a time and bind the appropriate callback
	  // function.  for any key leading up to the final one it should
	  // increase the sequence. after the final, it should reset all sequences
	  //
	  // if an action is specified in the original bind call then that will
	  // be used throughout.  otherwise we will pass the action that the
	  // next key in the sequence should match.  this allows a sequence
	  // to mix and match keypress and keydown events depending on which
	  // ones are better suited to the key provided
	  for (var j = 0; j < keys.length; ++j) {
	    var isFinal = j + 1 === keys.length
	    var wrappedCallback = isFinal ? callbackAndReset : increaseSequence(action || self.getKeyInfo(keys[j + 1]).action)
	    self.bindSingle(keys[j], wrappedCallback, action, combo, j)
	  }
	}
	});

	var bindSequence$1 = interopDefault(bindSequence);


	var require$$3$1 = Object.freeze({
	  default: bindSequence$1
	});

	var resetSequenceTimer = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'
	/**
	 * called to set a 1 second timeout on the specified sequence
	 *
	 * this is so after each key press in the sequence you have 1 second
	 * to press the next key before you have to start over
	 *
	 * @returns void
	 */
	module.exports = function () {
	  var self = this

	  clearTimeout(self.resetTimer)
	  self.resetTimer = setTimeout(
	    function () {
	      self.resetSequences()
	    },
	    1000
	  )
	}
	});

	var resetSequenceTimer$1 = interopDefault(resetSequenceTimer);


	var require$$2$1 = Object.freeze({
	  default: resetSequenceTimer$1
	});

	var detach = createCommonjsModule(function (module) {
	var off = interopDefault(require$$0).off
	module.exports = function () {
	  var self = this
	  var element = self.element

	  off(element, 'keypress', self.eventHandler)
	  off(element, 'keydown', self.eventHandler)
	  off(element, 'keyup', self.eventHandler)
	}
	});

	var detach$1 = interopDefault(detach);


	var require$$1$3 = Object.freeze({
	  default: detach$1
	});

	var reset$3 = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	module.exports = function () {
	  var self = this

	  self.instances.forEach(function (combokeys) {
	    combokeys.reset()
	  })
	}
	});

	var reset$4 = interopDefault(reset$3);


	var require$$0$8 = Object.freeze({
	  default: reset$4
	});

	var index = createCommonjsModule(function (module) {
	/* eslint-env node, browser */
	'use strict'

	module.exports = function (element) {
	  var self = this
	  var Combokeys = self.constructor

	  /**
	   * a list of all the callbacks setup via Combokeys.bind()
	   *
	   * @type {Object}
	   */
	  self.callbacks = {}

	  /**
	   * direct map of string combinations to callbacks used for trigger()
	   *
	   * @type {Object}
	   */
	  self.directMap = {}

	  /**
	   * keeps track of what level each sequence is at since multiple
	   * sequences can start out with the same sequence
	   *
	   * @type {Object}
	   */
	  self.sequenceLevels = {}

	  /**
	   * variable to store the setTimeout call
	   *
	   * @type {null|number}
	   */
	  self.resetTimer

	  /**
	   * temporary state where we will ignore the next keyup
	   *
	   * @type {boolean|string}
	   */
	  self.ignoreNextKeyup = false

	  /**
	   * temporary state where we will ignore the next keypress
	   *
	   * @type {boolean}
	   */
	  self.ignoreNextKeypress = false

	  /**
	   * are we currently inside of a sequence?
	   * type of action ("keyup" or "keydown" or "keypress") or false
	   *
	   * @type {boolean|string}
	   */
	  self.nextExpectedAction = false

	  self.element = element

	  self.addEvents()

	  Combokeys.instances.push(self)
	  return self
	}

	module.exports.prototype.bind = interopDefault(require$$18)
	module.exports.prototype.bindMultiple = interopDefault(require$$17)
	module.exports.prototype.unbind = interopDefault(require$$16)
	module.exports.prototype.trigger = interopDefault(require$$15)
	module.exports.prototype.reset = interopDefault(require$$14)
	module.exports.prototype.stopCallback = interopDefault(require$$13)
	module.exports.prototype.handleKey = interopDefault(require$$12)
	module.exports.prototype.addEvents = interopDefault(require$$11)
	module.exports.prototype.bindSingle = interopDefault(require$$10)
	module.exports.prototype.getKeyInfo = interopDefault(require$$9)
	module.exports.prototype.pickBestAction = interopDefault(require$$8)
	module.exports.prototype.getReverseMap = interopDefault(require$$7)
	module.exports.prototype.getMatches = interopDefault(require$$6)
	module.exports.prototype.resetSequences = interopDefault(require$$5)
	module.exports.prototype.fireCallback = interopDefault(require$$4)
	module.exports.prototype.bindSequence = interopDefault(require$$3$1)
	module.exports.prototype.resetSequenceTimer = interopDefault(require$$2$1)
	module.exports.prototype.detach = interopDefault(require$$1$3)

	module.exports.instances = []
	module.exports.reset = interopDefault(require$$0$8)

	/**
	 * variable to store the flipped version of MAP from above
	 * needed to check if we should use keypress or not when no action
	 * is specified
	 *
	 * @type {Object|undefined}
	 */
	module.exports.REVERSE_MAP = null
	});

	var Combokeys = interopDefault(index);

	var undomanager = createCommonjsModule(function (module) {
	/*
	Simple Javascript undo and redo.
	https://github.com/ArthurClemens/Javascript-Undo-Manager
	*/

	;(function() {

		'use strict';

	    function removeFromTo(array, from, to) {
	        array.splice(from,
	            !to ||
	            1 + to - from + (!(to < 0 ^ from >= 0) && (to < 0 || -1) * array.length));
	        return array.length;
	    }

	    var UndoManager = function() {

	        var commands = [],
	            index = -1,
	            limit = 0,
	            isExecuting = false,
	            callback,
	            
	            // functions
	            execute;

	        execute = function(command, action) {
	            if (!command || typeof command[action] !== "function") {
	                return this;
	            }
	            isExecuting = true;

	            command[action]();

	            isExecuting = false;
	            return this;
	        };

	        return {

	            /*
	            Add a command to the queue.
	            */
	            add: function (command) {
	                if (isExecuting) {
	                    return this;
	                }
	                // if we are here after having called undo,
	                // invalidate items higher on the stack
	                commands.splice(index + 1, commands.length - index);

	                commands.push(command);
	                
	                // if limit is set, remove items from the start
	                if (limit && commands.length > limit) {
	                    removeFromTo(commands, 0, -(limit+1));
	                }
	                
	                // set the current index to the end
	                index = commands.length - 1;
	                if (callback) {
	                    callback();
	                }
	                return this;
	            },

	            /*
	            Pass a function to be called on undo and redo actions.
	            */
	            setCallback: function (callbackFunc) {
	                callback = callbackFunc;
	            },

	            /*
	            Perform undo: call the undo function at the current index and decrease the index by 1.
	            */
	            undo: function () {
	                var command = commands[index];
	                if (!command) {
	                    return this;
	                }
	                execute(command, "undo");
	                index -= 1;
	                if (callback) {
	                    callback();
	                }
	                return this;
	            },

	            /*
	            Perform redo: call the redo function at the next index and increase the index by 1.
	            */
	            redo: function () {
	                var command = commands[index + 1];
	                if (!command) {
	                    return this;
	                }
	                execute(command, "redo");
	                index += 1;
	                if (callback) {
	                    callback();
	                }
	                return this;
	            },

	            /*
	            Clears the memory, losing all stored states. Reset the index.
	            */
	            clear: function () {
	                var prev_size = commands.length;

	                commands = [];
	                index = -1;

	                if (callback && (prev_size > 0)) {
	                    callback();
	                }
	            },

	            hasUndo: function () {
	                return index !== -1;
	            },

	            hasRedo: function () {
	                return index < (commands.length - 1);
	            },

	            getCommands: function () {
	                return commands;
	            },

	            getIndex: function() {
	                return index;
	            },
	            
	            setLimit: function (l) {
	                limit = l;
	            }
	        };
	    };

		if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
			// AMD. Register as an anonymous module.
			define(function() {
				return UndoManager;
			});
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = UndoManager;
		} else {
			window.UndoManager = UndoManager;
		}

	}());
	});

	var UndoManager = interopDefault(undomanager);

	var utils = createCommonjsModule(function (module, exports) {
	'use strict';

	Object.defineProperty(exports, '__esModule', { value: true });

	var allNewLines = /\r\n|\r|\n/g

	var onNewLine = /\r\n|\r|\n/

	var leadingWhitespace = /^\s*/

	var allCharacters = /./g

	var removeIfStartsWith = function (s) { return function (line) { return line.startsWith(s) ? line.slice(s.length) : line }; }

	var defineNewLine = function () {
	  var ta = document.createElement('textarea')
	  ta.value = '\n'
	  if (ta.value.length === 2)
	    return '\r\n';
	  else
	    return '\n';
	}

	var nthOccurrance = function (string, character, n) {
	  var count = 0, i = 0;
	  while (count < n && (i = string.indexOf(character, i) + 1)) {
	    count++;
	  }
	  if (count == n) return i;
	  return NaN;
	}

	exports.allNewLines = allNewLines;
	exports.onNewLine = onNewLine;
	exports.leadingWhitespace = leadingWhitespace;
	exports.allCharacters = allCharacters;
	exports.removeIfStartsWith = removeIfStartsWith;
	exports.defineNewLine = defineNewLine;
	exports.nthOccurrance = nthOccurrance;
	});

	var utils$1 = interopDefault(utils);
	var nthOccurrance = utils.nthOccurrance;
	var defineNewLine = utils.defineNewLine;
	var removeIfStartsWith = utils.removeIfStartsWith;
	var allCharacters = utils.allCharacters;
	var leadingWhitespace = utils.leadingWhitespace;
	var onNewLine = utils.onNewLine;
	var allNewLines = utils.allNewLines;

var require$$0$9 = Object.freeze({
	  default: utils$1,
	  nthOccurrance: nthOccurrance,
	  defineNewLine: defineNewLine,
	  removeIfStartsWith: removeIfStartsWith,
	  allCharacters: allCharacters,
	  leadingWhitespace: leadingWhitespace,
	  onNewLine: onNewLine,
	  allNewLines: allNewLines
	});

	var string = createCommonjsModule(function (module, exports) {
	"use strict"

	Object.defineProperty(exports, '__esModule', { value: true });

	var utils = interopDefault(require$$0$9)
	var leadingWhitespace = utils.leadingWhitespace
	var removeIfStartsWith = utils.removeIfStartsWith
	var onNewLine = utils.onNewLine
	var allNewLines = utils.allNewLines
	var allCharacters = utils.allCharacters


	var autoIndent = function (newLine, tab, prefix, selected, suffix) {
	  var prevLine = prefix.split(onNewLine).splice(-1)[0]
	  var prefEnd = prefix.slice(-1)
	  var suffStart = suffix.charAt(0)

	  if ((prevLine.match(/\(/g) || []).length > (prevLine.match(/\)/g) || []).length) {
	    var whitespace = prevLine.match(leadingWhitespace)[0]
	    prefix += newLine + whitespace + prevLine.slice(whitespace.length, prevLine.lastIndexOf('(') + 1).replace(allCharacters, ' ')
	  } else if (prefEnd === '{') {
	    prefix += newLine + prevLine.match(leadingWhitespace)[0] + tab
	    if (suffStart === '}')
	      suffix = newLine + prevLine.match(leadingWhitespace)[0] + suffix
	  } else {
	    prefix += newLine + prevLine.match(leadingWhitespace)[0]
	  }
	  selected = ''
	  if (suffix === '') suffix = newLine
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	var autoOpen = function (opening, closing, prefix, selected, suffix) {
	  prefix += opening
	  suffix = closing + suffix
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	var autoStrip = function (prefix, selected, suffix) {
	  prefix = prefix.slice(0, -1)
	  suffix = suffix.slice(1)
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	// content in selection is handled in index.js
	var testAutoStrip = function (pairs, prefix, selected, suffix) {
	  var result = false
	  pairs.forEach(function (ref) {
	    var opening = ref[0];
	    var closing = ref[1];

	    closing = closing ? closing : opening
	    if (prefix.slice(-1) === opening && suffix.charAt(0) === closing) result = true
	  })
	  return result
	}

	var overwrite = function (closing, prefix, selected, suffix) {
	  prefix += closing
	  suffix = suffix.slice(1)
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	// content in selection is handled in index.js
	var testOverwrite = function (closing, prefix, selected, suffix) {
	  return suffix.charAt(0) === closing
	}

	var tabIndent = function (newLine, tab, prefix, selected, suffix) {
	  var prefLines = prefix.split(onNewLine)
	  var prevLine = prefLines.splice(-1)[0]

	  if (selected === '') {
	    if (tab === '\t' || prevLine.length % tab.length === 0) {
	      prefix += tab
	    } else {
	      prefix += ' '.repeat(tab.length - prevLine.length % tab.length)
	    }
	  } else {
	    prevLine = tab + prevLine
	    prefix = prefLines.concat(prevLine).join(newLine)
	    selected = selected.replace(allNewLines, newLine + tab)
	  }
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	var tabUnindent = function (newLine, tab, prefix, selected, suffix) {
	  var lines = selected.split(onNewLine)
	  var prevLine = prefix.split(onNewLine).splice(-1)[0]

	  if (lines.length === 1) {
	    if (prefix.endsWith(tab))
	      prefix = prefix.slice(0, -tab.length)
	    else { // indent instead
	      if (tab === '\t' || prevLine.length % tab.length === 0) {
	        prefix += tab
	      } else {
	        prefix += ' '.repeat(tab.length - prevLine.length % tab.length)
	      }
	    }
	  } else {
	    var prevLength = prevLine.length

	    prevLine = removeIfStartsWith(tab)(prevLine)
	    prefix = prefix.slice(0, -prevLength) + prevLine
	    lines = lines.map(removeIfStartsWith(tab))
	    selected = lines.join(newLine)
	  }
	  return { prefix: prefix, selected: selected, suffix: suffix }
	}

	function StrUtil(newLine, tab) {
	  return {
	    autoIndent    : function () {
	      var args = [], len = arguments.length;
	      while ( len-- ) args[ len ] = arguments[ len ];

	      return autoIndent.apply(void 0, [ newLine, tab ].concat( args ));
	  },
	    autoOpen      : autoOpen,
	    autoStrip     : autoStrip,
	    testAutoStrip : testAutoStrip,
	    overwrite     : overwrite,
	    testOverwrite : testOverwrite,
	    tabIndent     : function () {
	      var args = [], len = arguments.length;
	      while ( len-- ) args[ len ] = arguments[ len ];

	      return tabIndent.apply(void 0, [ newLine, tab ].concat( args ));
	  },
	    tabUnindent   : function () {
	      var args = [], len = arguments.length;
	      while ( len-- ) args[ len ] = arguments[ len ];

	      return tabUnindent.apply(void 0, [ newLine, tab ].concat( args ));
	  }
	  }
	}

	exports.autoIndent = autoIndent;
	exports.autoOpen = autoOpen;
	exports.autoStrip = autoStrip;
	exports.testAutoStrip = testAutoStrip;
	exports.overwrite = overwrite;
	exports.testOverwrite = testOverwrite;
	exports.tabIndent = tabIndent;
	exports.tabUnindent = tabUnindent;
	exports['default'] = StrUtil;
	});

	var StrUtil = interopDefault(string);

	var getLinePosition = function (node) {
	  var text = ''
	  var sibling = node.previousSibling
	  while (sibling) {
	    text += sibling.textContent
	    sibling = sibling.previousSibling
	  }
	  return text.split(onNewLine).length - 1
	}

	var withSelection = function (fn) { return function () {
	  var sel = window.getSelection()
	  return fn(sel, sel.getRangeAt(0), getLinePosition(sel.anchorNode), sel.anchorOffset, getLinePosition(sel.focusNode), sel.focusOffset)
	}; }

	var withStartEnd = function (fn) {
	  return withSelection(function (selection, range, anchorLine, anchorOffset, focusLine, focusOffset) {
	    // console.log(`start l,r ${ anchorLine + ' ' + anchorOffset } end l,r ${ focusLine + ' ' + focusOffset }`)
	    // calls fn with (selection, range, startLine, startOffset, endLine, endOffset)
	    if (anchorLine == focusLine) {
	      return fn(selection, range, anchorLine, Math.min(anchorOffset, focusOffset), anchorLine, Math.max(anchorOffset, focusOffset))
	    } else if (anchorLine < focusLine) {
	      return fn(selection, range, anchorLine, anchorOffset, focusLine, focusOffset)
	    } else {
	      return fn(selection, range, focusLine, focusOffset, anchorLine, anchorOffset)
	    }
	  })
	}

	var setSelection = function (elem, prefixLen, rngLen) {
	  var node
	  if (elem.childNodes[0]) {
	    node = elem.childNodes[0]
	  } else {
	    node = elem
	    prefixLen, rngLen = 0
	  }
	  var selection = document.getSelection()
	  var range = document.createRange()
	  range.setStart(node, prefixLen)
	  range.setEnd(node, prefixLen + rngLen)
	  selection.removeAllRanges()
	  selection.addRange(range)
	}

	function store(value) {
	  function gettersetter() {
	    if (arguments.length) {
	      value = arguments[0]
	      // console.log(value)
	    }
	    return value
	  }
	  return gettersetter
	}

	var Misbehave = function Misbehave(elem, ref) {
	  if ( ref === void 0 ) ref = {};
	  var autoIndent = ref.autoIndent; if ( autoIndent === void 0 ) autoIndent = true;
	  var autoOpen = ref.autoOpen; if ( autoOpen === void 0 ) autoOpen = true;
	  var autoStrip = ref.autoStrip; if ( autoStrip === void 0 ) autoStrip = true;
	  var overwrite = ref.overwrite; if ( overwrite === void 0 ) overwrite = true;
	  var softTabs = ref.softTabs; if ( softTabs === void 0 ) softTabs = 2;
	  var replaceTab = ref.replaceTab; if ( replaceTab === void 0 ) replaceTab = true;
	  var pairs = ref.pairs; if ( pairs === void 0 ) pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"'], ["'"]];


	  var misbehave = this
	  var newLine = defineNewLine()
	  var strUtil = new StrUtil(newLine, softTabs ? ' '.repeat(softTabs) : '\t')

	  var undoMgr = new UndoManager()
	  var current = store({ prefix: '', selected: '', suffix: '' })

	  var setDom = function (value) {
	    elem.textContent = value.prefix + value.selected + value.suffix
	    setSelection(elem, value.prefix.length, value.selected.length)
	  }

	  var update = function (update, updateDom) {
	    var previous = current()
	    undoMgr.add({
	      undo : function () { setDom(previous) },
	      redo : function () { setDom(update) }
	    })
	    current(update)
	    if (updateDom) setDom(update)
	  }

	  var extract = function (fn) {
	    return withStartEnd(function (selection, range, startLine, startOffset, endLine, endOffset) {
	      var prefixIndex = nthOccurrance(elem.textContent, newLine, startLine) + startOffset
	      var prefix = elem.textContent.slice(0, prefixIndex)
	      var selected = range.toString()
	      var suffix = elem.textContent.slice(prefixIndex + selected.length)

	      // console.info('extracted', [prefix, selected, suffix])

	      return fn(selection, range, prefix, selected, suffix)
	    })
	  }

	  var keys = new Combokeys(elem)
	  keys.stopCallback = function () { return false; } // work without needing to set combokeys class on elements

	  keys.bind('mod+z', function () { undoMgr.undo(); return false })
	  keys.bind('shift+mod+z', function () { undoMgr.redo(); return false })

	  if (autoIndent) {
	    keys.bind('enter', extract(function (selection, range, prefix, selected, suffix) {
	      update(strUtil.autoIndent(prefix, selected, suffix), true)
	      return false
	    }))
	  }

	  if (autoStrip) {
	    keys.bind('backspace', extract(function (selection, range, prefix, selected, suffix) {
	      if (selection.isCollapsed && strUtil.testAutoStrip(pairs, prefix, selected, suffix)) {
	        update(strUtil.autoStrip(prefix, selected, suffix), true)
	        return false
	      }
	    }))
	  }

	  var fnAutoOpen = function (opening, closing) { return extract(function (selection, range, prefix, selected, suffix) {
	    update(strUtil.autoOpen(opening, closing, prefix, selected, suffix), true)
	    return false
	  }); }

	  var fnOverwrite = function (closing) { return extract(function (selection, range, prefix, selected, suffix) {
	    if (selection.isCollapsed && strUtil.testOverwrite(closing, prefix, selected, suffix)) {
	      update(strUtil.overwrite(closing, prefix, selected, suffix), true)
	      return false
	    }
	  }); }

	  pairs.forEach(function (ref) {
	    var opening = ref[0];
	    var closing = ref[1];

	    if (closing) {
	      if (autoOpen)keys.bind(opening, fnAutoOpen(opening, closing))
	      if (overwrite) keys.bind(closing, fnOverwrite(closing))
	    } else {
	      if (autoOpen && overwrite) {
	        keys.bind(opening, extract(function (selection, range, prefix, selected, suffix) {
	          if (selection.isCollapsed && strUtil.testOverwrite(opening, prefix, selected, suffix))
	            update(strUtil.overwrite(opening, prefix, selected, suffix), true)
	          else
	            update(strUtil.autoOpen(opening, opening, prefix, selected, suffix), true)
	          return false
	        }))
	      } else {
	        if (autoOpen)keys.bind(opening, fnAutoOpen(opening, opening))
	        if (overwrite) keys.bind(opening, fnOverwrite(opening))
	      }
	    }
	  })

	  if (replaceTab) {
	    keys.bind('tab', extract(function (selection, range, prefix, selected, suffix) {
	      update(strUtil.tabIndent(prefix, selected, suffix), true)
	      return false
	    }))

	    keys.bind('shift+tab', extract(function (selection, range, prefix, selected, suffix) {
	      update(strUtil.tabUnindent(prefix, selected, suffix), true)
	      return false
	    }))
	  }

	  var inputListener = elem.addEventListener('input', extract(function (selection, range, prefix, selected, suffix) {
	    update({ prefix: prefix, selected: selected, suffix: suffix })
	  }))

	  // expose for haxxoers
	  misbehave.__elem = elem
	  misbehave.__strUtil = strUtil
	  misbehave.__undoMgr = undoMgr
	  misbehave.__current = current
	  misbehave.__setDom = setDom
	  misbehave.__update = update
	  misbehave.__extract = extract
	  misbehave.__inputListener = inputListener
	  misbehave.__keys = keys
	};

	Misbehave.prototype.destroy = function destroy () {
	  this.__elem.removeEventListener('input', this.__inputListener)
	  this.__keys.destroy()
	  this.__undoMgr.clear()
	};

	return Misbehave;

}());