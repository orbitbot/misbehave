(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Misbehave', factory) :
	(global.Misbehave = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/* eslint-env node, browser */
var bind = function (keys, callback, action) {
  var self = this;

  keys = keys instanceof Array ? keys : [keys];
  self.bindMultiple(keys, callback, action);
  return self
};

/* eslint-env node, browser */
var bindMultiple = function (combinations, callback, action) {
  var self = this;

  for (var j = 0; j < combinations.length; ++j) {
    self.bindSingle(combinations[j], callback, action);
  }
};

/* eslint-env node, browser */
var unbind = function (keys, action) {
  var self = this;

  return self.bind(keys, function () {}, action)
};

/* eslint-env node, browser */
var trigger = function (keys, action) {
  var self = this;
  if (self.directMap[keys + ':' + action]) {
    self.directMap[keys + ':' + action]({}, keys);
  }
  return this
};

/* eslint-env node, browser */
var reset = function () {
  var self = this;
  self.callbacks = {};
  self.directMap = {};
  return this
};

/* eslint-env node, browser */
var stopCallback = function (e, element) {
  // if the element has the class "combokeys" then no need to stop
  if ((' ' + element.className + ' ').indexOf(' combokeys ') > -1) {
    return false
  }

  var tagName = element.tagName.toLowerCase();

  // stop for input, select, and textarea
  return tagName === 'input' || tagName === 'select' || tagName === 'textarea' || element.isContentEditable
};

/* eslint-env node, browser */
var isModifier = function (key) {
  return key === 'shift' || key === 'ctrl' || key === 'alt' || key === 'meta'
};

var handleKey = function (character, modifiers, e) {
  var self = this;
  var callbacks;
  var j;
  var doNotReset = {};
  var maxLevel = 0;
  var processedSequenceCallback = false;
  var isModifier$$1;
  var ignoreThisKeypress;

  callbacks = self.getMatches(character, modifiers, e);
  // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
  for (j = 0; j < callbacks.length; ++j) {
    if (callbacks[j].seq) {
      maxLevel = Math.max(maxLevel, callbacks[j].level);
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

      processedSequenceCallback = true;

      // keep a list of which sequences were matches for later
      doNotReset[callbacks[j].seq] = 1;
      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo, callbacks[j].seq);
      continue
    }

    // if there were no sequence matches but we are still here
    // that means this is a regular match so we should fire that
    if (!processedSequenceCallback) {
      self.fireCallback(callbacks[j].callback, e, callbacks[j].combo);
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
  ignoreThisKeypress = e.type === 'keypress' && self.ignoreNextKeypress;
  isModifier$$1 = isModifier;
  if (e.type === self.nextExpectedAction && !isModifier$$1(character) && !ignoreThisKeypress) {
    self.resetSequences(doNotReset);
  }

  self.ignoreNextKeypress = processedSequenceCallback && e.type === 'keydown';
};

var domEvent = on;
var on_1 = on;
var off_1 = off;

function on (element, event, callback, capture) {
  !element.addEventListener && (event = 'on' + event)
  ;(element.addEventListener || element.attachEvent).call(element, event, callback, capture);
  return callback
}

function off (element, event, callback, capture) {
  !element.removeEventListener && (event = 'on' + event)
  ;(element.removeEventListener || element.detachEvent).call(element, event, callback, capture);
  return callback
}

domEvent.on = on_1;
domEvent.off = off_1;

var specialKeysMap = createCommonjsModule(function (module) {
/* eslint-env node, browser */
'use strict';
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
};

/**
 * loop through the f keys, f1 to f19 and add them to the map
 * programatically
 */
for (var i = 1; i < 20; ++i) {
  module.exports[111 + i] = 'f' + i;
}

/**
 * loop through to map numbers on the numeric keypad
 */
for (i = 0; i <= 9; ++i) {
  module.exports[i + 96] = i;
}
});

/* eslint-env node, browser */
var specialCharactersMap = {
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
};

var characterFromEvent = function (e) {
  var SPECIAL_KEYS_MAP,
    SPECIAL_CHARACTERS_MAP;
  SPECIAL_KEYS_MAP = specialKeysMap;
  SPECIAL_CHARACTERS_MAP = specialCharactersMap;

  // for keypress events we should return the character as is
  if (e.type === 'keypress') {
    var character = String.fromCharCode(e.which);

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
      character = character.toLowerCase();
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
};

/* eslint-env node, browser */
var eventModifiers = function (e) {
  var modifiers = [];

  if (e.shiftKey) {
    modifiers.push('shift');
  }

  if (e.altKey) {
    modifiers.push('alt');
  }

  if (e.ctrlKey) {
    modifiers.push('ctrl');
  }

  if (e.metaKey) {
    modifiers.push('meta');
  }

  return modifiers
};

var handleKeyEvent = function (e) {
  var self = this;
  var characterFromEvent$$1;
  var eventModifiers$$1;

  // normalize e.which for key events
  // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
  if (typeof e.which !== 'number') {
    e.which = e.keyCode;
  }
  characterFromEvent$$1 = characterFromEvent;
  var character = characterFromEvent$$1(e);

  // no character found then stop
  if (!character) {
    return
  }

  // need to use === for the character check because the character can be 0
  if (e.type === 'keyup' && self.ignoreNextKeyup === character) {
    self.ignoreNextKeyup = false;
    return
  }

  eventModifiers$$1 = eventModifiers;
  self.handleKey(character, eventModifiers$$1(e), e);
};

var addEvents = function () {
  var self = this;
  var on = domEvent;
  var element = self.element;

  self.eventHandler = handleKeyEvent.bind(self);

  on(element, 'keypress', self.eventHandler);
  on(element, 'keydown', self.eventHandler);
  on(element, 'keyup', self.eventHandler);
};

/* eslint-env node, browser */
var bindSingle = function (combination, callback, action, sequenceName, level) {
  var self = this;

  // store a direct mapped reference for use with Combokeys.trigger
  self.directMap[combination + ':' + action] = callback;

  // make sure multiple spaces in a row become a single space
  combination = combination.replace(/\s+/g, ' ');

  var sequence = combination.split(' ');
  var info;

  // if this pattern is a sequence of keys then run through this method
  // to reprocess each pattern one key at a time
  if (sequence.length > 1) {
    self.bindSequence(combination, sequence, callback, action);
    return
  }

  info = self.getKeyInfo(combination, action);

  // make sure to initialize array if this is the first time
  // a callback is added for this key
  self.callbacks[info.key] = self.callbacks[info.key] || [];

  // remove an existing match if there is one
  self.getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

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
  });
};

/* eslint-env node, browser */
var keysFromString = function (combination) {
  if (combination === '+') {
    return ['+']
  }

  return combination.split('+')
};

/* eslint-env node, browser */
var specialAliases = {
  'option': 'alt',
  'command': 'meta',
  'return': 'enter',
  'escape': 'esc',
  'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
};

/* eslint-env node, browser */
var shiftMap = {
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
};

var getKeyInfo = function (combination, action) {
  var self = this;
  var keysFromString$$1;
  var keys;
  var key;
  var j;
  var modifiers = [];
  var SPECIAL_ALIASES;
  var SHIFT_MAP;
  var isModifier$$1;

  keysFromString$$1 = keysFromString;
  // take the keys from this pattern and figure out what the actual
  // pattern is all about
  keys = keysFromString$$1(combination);

  SPECIAL_ALIASES = specialAliases;
  SHIFT_MAP = shiftMap;
  isModifier$$1 = isModifier;
  for (j = 0; j < keys.length; ++j) {
    key = keys[j];

    // normalize key names
    if (SPECIAL_ALIASES[key]) {
      key = SPECIAL_ALIASES[key];
    }

    // if this is not a keypress event then we should
    // be smart about using shift keys
    // this will only work for US keyboards however
    if (action && action !== 'keypress' && SHIFT_MAP[key]) {
      key = SHIFT_MAP[key];
      modifiers.push('shift');
    }

    // if this key is a modifier then add it to the list of modifiers
    if (isModifier$$1(key)) {
      modifiers.push(key);
    }
  }

  // depending on what the key combination is
  // we will try to pick the best event for it
  action = self.pickBestAction(key, modifiers, action);

  return {
    key: key,
    modifiers: modifiers,
    action: action
  }
};

/* eslint-env node, browser */
var pickBestAction = function (key, modifiers, action) {
  var self = this;

  // if no action was picked in we should try to pick the one
  // that we think would work best for this key
  if (!action) {
    action = self.getReverseMap()[key] ? 'keydown' : 'keypress';
  }

  // modifier keys don't work as expected with keypress,
  // switch to keydown
  if (action === 'keypress' && modifiers.length) {
    action = 'keydown';
  }

  return action
};

var getReverseMap = function () {
  var self = this;
  var constructor = self.constructor;
  var SPECIAL_KEYS_MAP;

  if (!constructor.REVERSE_MAP) {
    constructor.REVERSE_MAP = {};
    SPECIAL_KEYS_MAP = specialKeysMap;
    for (var key in SPECIAL_KEYS_MAP) {
      // pull out the numeric keypad from here cause keypress should
      // be able to detect the keys from the character
      if (key > 95 && key < 112) {
        continue
      }

      if (SPECIAL_KEYS_MAP.hasOwnProperty(key)) {
        constructor.REVERSE_MAP[SPECIAL_KEYS_MAP[key]] = key;
      }
    }
  }
  return constructor.REVERSE_MAP
};

/* eslint-env node, browser */
var modifiersMatch = function (modifiers1, modifiers2) {
  return modifiers1.sort().join(',') === modifiers2.sort().join(',')
};

var getMatches = function (character, modifiers, e, sequenceName, combination, level) {
  var self = this;
  var j;
  var callback;
  var matches = [];
  var action = e.type;
  var isModifier$$1;
  var modifiersMatch$$1;

  if (
      action === 'keypress' &&
      // Firefox fires keypress for arrows
      !(e.code && e.code.slice(0, 5) === 'Arrow')
  ) {
    // 'any-character' callbacks are only on `keypress`
    var anyCharCallbacks = self.callbacks['any-character'] || [];
    anyCharCallbacks.forEach(function (callback) {
      matches.push(callback);
    });
  }

  if (!self.callbacks[character]) { return matches }

  isModifier$$1 = isModifier;
  // if a modifier key is coming up on its own we should allow it
  if (action === 'keyup' && isModifier$$1(character)) {
    modifiers = [character];
  }

  // loop through all callbacks for the key that was pressed
  // and see if any of them match
  for (j = 0; j < self.callbacks[character].length; ++j) {
    callback = self.callbacks[character][j];

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
    modifiersMatch$$1 = modifiersMatch;
    if ((action === 'keypress' && !e.metaKey && !e.ctrlKey) || modifiersMatch$$1(modifiers, callback.modifiers)) {
      // when you bind a combination or sequence a second time it
      // should overwrite the first one.  if a sequenceName or
      // combination is specified in this call it does just that
      //
      // @todo make deleting its own method?
      var deleteCombo = !sequenceName && callback.combo === combination;
      var deleteSequence = sequenceName && callback.seq === sequenceName && callback.level === level;
      if (deleteCombo || deleteSequence) {
        self.callbacks[character].splice(j, 1);
      }

      matches.push(callback);
    }
  }

  return matches
};

/* eslint-env node, browser */
var resetSequences = function (doNotReset) {
  var self = this;

  doNotReset = doNotReset || {};

  var activeSequences = false;
  var key;

  for (key in self.sequenceLevels) {
    if (doNotReset[key]) {
      activeSequences = true;
      continue
    }
    self.sequenceLevels[key] = 0;
  }

  if (!activeSequences) {
    self.nextExpectedAction = false;
  }
};

/* eslint-env node, browser */
var preventDefault = function (e) {
  if (e.preventDefault) {
    e.preventDefault();
    return
  }

  e.returnValue = false;
};

/* eslint-env node, browser */
var stopPropagation = function (e) {
  if (e.stopPropagation) {
    e.stopPropagation();
    return
  }

  e.cancelBubble = true;
};

var fireCallback = function (callback, e, combo, sequence) {
  var self = this;
  var preventDefault$$1;
  var stopPropagation$$1;

  // if this event should not happen stop here
  if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
    return
  }

  if (callback(e, combo) === false) {
    preventDefault$$1 = preventDefault;
    preventDefault$$1(e);
    stopPropagation$$1 = stopPropagation;
    stopPropagation$$1(e);
  }
};

var bindSequence = function (combo, keys, callback, action) {
  var self = this;

  // start off by adding a sequence level record for this combination
  // and setting the level to 0
  self.sequenceLevels[combo] = 0;

  /**
   * callback to increase the sequence level for this sequence and reset
   * all other sequences that were active
   *
   * @param {string} nextAction
   * @returns {Function}
   */
  function increaseSequence (nextAction) {
    return function () {
      self.nextExpectedAction = nextAction;
      ++self.sequenceLevels[combo];
      self.resetSequenceTimer();
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
    var characterFromEvent$$1;
    self.fireCallback(callback, e, combo);

    // we should ignore the next key up if the action is key down
    // or keypress.  this is so if you finish a sequence and
    // release the key the final key will not trigger a keyup
    if (action !== 'keyup') {
      characterFromEvent$$1 = characterFromEvent;
      self.ignoreNextKeyup = characterFromEvent$$1(e);
    }

    // weird race condition if a sequence ends with the key
    // another sequence begins with
    setTimeout(
      function () {
        self.resetSequences();
      },
      10
    );
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
    var isFinal = j + 1 === keys.length;
    var wrappedCallback = isFinal ? callbackAndReset : increaseSequence(action || self.getKeyInfo(keys[j + 1]).action);
    self.bindSingle(keys[j], wrappedCallback, action, combo, j);
  }
};

/* eslint-env node, browser */
var resetSequenceTimer = function () {
  var self = this;

  clearTimeout(self.resetTimer);
  self.resetTimer = setTimeout(
    function () {
      self.resetSequences();
    },
    1000
  );
};

var off$1 = domEvent.off;
var detach = function () {
  var self = this;
  var element = self.element;

  off$1(element, 'keypress', self.eventHandler);
  off$1(element, 'keydown', self.eventHandler);
  off$1(element, 'keyup', self.eventHandler);
};

/* eslint-env node, browser */
var reset$2 = function () {
  var self = this;

  self.instances.forEach(function (combokeys) {
    combokeys.reset();
  });
};

var index = createCommonjsModule(function (module) {
/* eslint-env node, browser */
'use strict';

module.exports = function (element) {
  var self = this;
  var Combokeys = self.constructor;

  /**
   * a list of all the callbacks setup via Combokeys.bind()
   *
   * @type {Object}
   */
  self.callbacks = {};

  /**
   * direct map of string combinations to callbacks used for trigger()
   *
   * @type {Object}
   */
  self.directMap = {};

  /**
   * keeps track of what level each sequence is at since multiple
   * sequences can start out with the same sequence
   *
   * @type {Object}
   */
  self.sequenceLevels = {};

  /**
   * variable to store the setTimeout call
   *
   * @type {null|number}
   */
  self.resetTimer;

  /**
   * temporary state where we will ignore the next keyup
   *
   * @type {boolean|string}
   */
  self.ignoreNextKeyup = false;

  /**
   * temporary state where we will ignore the next keypress
   *
   * @type {boolean}
   */
  self.ignoreNextKeypress = false;

  /**
   * are we currently inside of a sequence?
   * type of action ("keyup" or "keydown" or "keypress") or false
   *
   * @type {boolean|string}
   */
  self.nextExpectedAction = false;

  self.element = element;

  self.addEvents();

  Combokeys.instances.push(self);
  return self
};

module.exports.prototype.bind = bind;
module.exports.prototype.bindMultiple = bindMultiple;
module.exports.prototype.unbind = unbind;
module.exports.prototype.trigger = trigger;
module.exports.prototype.reset = reset;
module.exports.prototype.stopCallback = stopCallback;
module.exports.prototype.handleKey = handleKey;
module.exports.prototype.addEvents = addEvents;
module.exports.prototype.bindSingle = bindSingle;
module.exports.prototype.getKeyInfo = getKeyInfo;
module.exports.prototype.pickBestAction = pickBestAction;
module.exports.prototype.getReverseMap = getReverseMap;
module.exports.prototype.getMatches = getMatches;
module.exports.prototype.resetSequences = resetSequences;
module.exports.prototype.fireCallback = fireCallback;
module.exports.prototype.bindSequence = bindSequence;
module.exports.prototype.resetSequenceTimer = resetSequenceTimer;
module.exports.prototype.detach = detach;

module.exports.instances = [];
module.exports.reset = reset$2;

/**
 * variable to store the flipped version of MAP from above
 * needed to check if we should use keypress or not when no action
 * is specified
 *
 * @type {Object|undefined}
 */
module.exports.REVERSE_MAP = null;
});

var undomanager = createCommonjsModule(function (module) {
/*
Simple Javascript undo and redo.
https://github.com/ArthurClemens/Javascript-Undo-Manager
*/

(function() {

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

	if (typeof undefined === 'function' && typeof undefined.amd === 'object' && undefined.amd) {
		// AMD. Register as an anonymous module.
		undefined(function() {
			return UndoManager;
		});
	} else if ('object' !== 'undefined' && module.exports) {
		module.exports = UndoManager;
	} else {
		window.UndoManager = UndoManager;
	}

}());
});

var getSections = function (elem, callback) {
  var sel, range, tempRange, prefix = '', selected = '', suffix = '';

  if (document.activeElement !== elem) {
    suffix = elem.textContent;
  } else if (typeof window.getSelection !== 'undefined') {
    sel = window.getSelection();
    selected = sel.toString();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
    } else {
      range = document.createRange();
      range.collapse(true);
    }
    tempRange = document.createRange();
    tempRange.selectNodeContents(elem);
    tempRange.setEnd(range.startContainer, range.startOffset);
    prefix = tempRange.toString();

    tempRange.selectNodeContents(elem);
    tempRange.setStart(range.endContainer, range.endOffset);
    suffix = tempRange.toString();

    tempRange.detach();
  } else if ( (sel = document.selection) && sel.type != 'Control') {
    range = sel.createRange();
    tempRange = document.body.createTextRange();
    selected = tempRange.text;

    tempRange.moveToElementText(elem);
    tempRange.setEndPoint('EndToStart', range);
    prefix = tempRange.text;

    tempRange.moveToElementText(elem);
    tempRange.setEndPoint('StartToEnd', range);
    suffix = tempRange.text;
  }

  if (callback)
    { return callback({ prefix: prefix, selected: selected, suffix: suffix }, sel) }
  else
    { return { prefix: prefix, selected: selected, suffix: suffix } }
};

var getTextNodesIn = function (node) {
  var textNodes = [];
  if (node.nodeType == 3) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0, len = children.length; i < len; ++i) {
      textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
    }
  }
  return textNodes
};

var setSelection = function (elem, start, end) {
  if (document.createRange && window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents(elem);
    var textNodes = getTextNodesIn(elem);
    var foundStart = false;
    var charCount = 0, endCharCount;

    for (var i = 0, textNode; textNode = textNodes[i++]; ) {
      endCharCount = charCount + textNode.length;
      if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
        range.setStart(textNode, start - charCount);
        foundStart = true;
      }
      if (foundStart && end <= endCharCount) {
        range.setEnd(textNode, end - charCount);
        break
      }
      charCount = endCharCount;
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(elem);
    textRange.collapse(true);
    textRange.moveEnd('character', end);
    textRange.moveStart('character', start);
    textRange.select();
  }
};

var allNewLines = /\r\n|\r|\n/g;

var onNewLine = /\r\n|\r|\n/;

var leadingWhitespace = /^\s*/;

var allCharacters = /./g;

var removeIfStartsWith = function (s) { return function (line) { return line.startsWith(s) ? line.slice(s.length) : line; }; };

var defineNewLine = function () {
  var ta = document.createElement('textarea');
  ta.value = '\n';
  if (ta.value.length === 2)
    { return '\r\n' }
  else
    { return '\n' }
};

var Editable = function Editable(elem, ref) {
  if ( ref === void 0 ) ref = {};
  var autoIndent = ref.autoIndent; if ( autoIndent === void 0 ) autoIndent = true;
  var autoOpen = ref.autoOpen; if ( autoOpen === void 0 ) autoOpen = true;
  var autoStrip = ref.autoStrip; if ( autoStrip === void 0 ) autoStrip = true;
  var overwrite = ref.overwrite; if ( overwrite === void 0 ) overwrite = true;
  var softTabs = ref.softTabs; if ( softTabs === void 0 ) softTabs = 2;
  var replaceTab = ref.replaceTab; if ( replaceTab === void 0 ) replaceTab = true;
  var pairs = ref.pairs; if ( pairs === void 0 ) pairs = [['(', ')'], ['[', ']'], ['{', '}'], ['"'], ["'"]];
  var oninput = ref.oninput; if ( oninput === void 0 ) oninput = function () {};
  var undoLimit = ref.undoLimit; if ( undoLimit === void 0 ) undoLimit = 0;
  var behavior = ref.behavior;
  var store = ref.store;


  var editable = this;
  var handler = behavior(defineNewLine(), softTabs ? ' '.repeat(softTabs) : '\t');

  var undoMgr = new undomanager();
  undoMgr.setLimit(undoLimit);

  var setDom = function (value) {
    var content = value.prefix + value.selected + value.suffix;
    elem.textContent = content;
    oninput(content, value);
    setSelection(elem, value.prefix.length, value.prefix.length + value.selected.length);
  };

  var update = function (content) {
    var previous = store();
    undoMgr.add({
      undo : function () { setDom(previous); },
      redo : function () { setDom(content); }
    });
    store(content);
    setDom(content);
  };

  var keys = new index(elem);
  keys.stopCallback = function () { return false; }; // work without needing to set combokeys class on elements

  keys.bind('mod+z', function () { undoMgr.undo(); return false });
  keys.bind('shift+mod+z', function () { undoMgr.redo(); return false });

  if (autoIndent) {
    keys.bind('enter', function () { return getSections(elem, function (ref) {
      var prefix = ref.prefix;
      var selected = ref.selected;
      var suffix = ref.suffix;

      update(handler.autoIndent(prefix, selected, suffix));
      return false
    }); });
  }

  if (autoStrip) {
    keys.bind('backspace', function () { return getSections(elem, function (ref, selection) {
      var prefix = ref.prefix;
      var selected = ref.selected;
      var suffix = ref.suffix;

      if (selection.isCollapsed && handler.testAutoStrip(pairs, prefix, selected, suffix)) {
        update(handler.autoStrip(prefix, selected, suffix));
        return false
      }
    }); });
  }

  var fnAutoOpen = function (opening, closing) { return function () { return getSections(elem, function (ref) {
    var prefix = ref.prefix;
    var selected = ref.selected;
    var suffix = ref.suffix;

    update(handler.autoOpen(opening, closing, prefix, selected, suffix));
    return false
  }); }; };

  var fnOverwrite = function (closing) { return function () { return getSections(elem, function (ref, selection) {
    var prefix = ref.prefix;
    var selected = ref.selected;
    var suffix = ref.suffix;

    if (selection.isCollapsed && handler.testOverwrite(closing, prefix, selected, suffix)) {
      update(handler.overwrite(closing, prefix, selected, suffix));
      return false
    }
  }); }; };

  pairs.forEach(function (ref) {
    var opening = ref[0];
    var closing = ref[1];

    if (closing) {
      if (autoOpen){ keys.bind(opening, fnAutoOpen(opening, closing)); }
      if (overwrite) { keys.bind(closing, fnOverwrite(closing)); }
    } else {
      if (autoOpen && overwrite) {
        keys.bind(opening, function () { return getSections(elem, function (ref, selection) {
          var prefix = ref.prefix;
          var selected = ref.selected;
          var suffix = ref.suffix;

          if (selection.isCollapsed && handler.testOverwrite(opening, prefix, selected, suffix))
            { update(handler.overwrite(opening, prefix, selected, suffix)); }
          else
            { update(handler.autoOpen(opening, opening, prefix, selected, suffix)); }
          return false
        }); });
      } else {
        if (autoOpen){ keys.bind(opening, fnAutoOpen(opening, opening)); }
        if (overwrite) { keys.bind(opening, fnOverwrite(opening)); }
      }
    }
  });

  if (replaceTab) {
    keys.bind('tab', function () { return getSections(elem, function (ref) {
      var prefix = ref.prefix;
      var selected = ref.selected;
      var suffix = ref.suffix;

      update(handler.tabIndent(prefix, selected, suffix));
      return false
    }); });

    keys.bind('shift+tab', function () { return getSections(elem, function (ref) {
      var prefix = ref.prefix;
      var selected = ref.selected;
      var suffix = ref.suffix;

      update(handler.tabUnindent(prefix, selected, suffix));
      return false
    }); });
  }

  editable.inputListener = elem.addEventListener('input', function () { return getSections(elem, update); });

  oninput(elem.textContent, store());

  // expose for haxxoers
  editable.elem = elem;
  editable.handler = handler;
  editable.undoMgr = undoMgr;
  editable.store = store;
  editable.setDom = setDom;
  editable.update = update;
  editable.keys = keys;
};

Editable.prototype.destroy = function destroy () {
  this.elem.removeEventListener('input', this.inputListener);
  this.keys.detach();
  this.undoMgr.clear();
};

Editable.prototype.focus = function focus () {
  this.elem.focus();
};

Editable.prototype.blur = function blur () {
  this.elem.blur();
};

function store(value) {
  function gettersetter() {
    if (arguments.length) {
      value = arguments[0];
    }
    return value
  }
  return gettersetter
}

var autoIndent = function (newLine, tab, prefix, selected, suffix) {
  var prevLine = prefix.split(onNewLine).splice(-1)[0];
  var prefEnd = prefix.slice(-1);
  var suffStart = suffix.charAt(0);

  if ((prevLine.match(/\(/g) || []).length > (prevLine.match(/\)/g) || []).length) {
    var whitespace = prevLine.match(leadingWhitespace)[0];
    prefix += newLine + whitespace + prevLine.slice(whitespace.length, prevLine.lastIndexOf('(') + 1).replace(allCharacters, ' ');
  } else if (prefEnd === '{') {
    prefix += newLine + prevLine.match(leadingWhitespace)[0] + tab;
    if (suffStart === '}')
      { suffix = newLine + prevLine.match(leadingWhitespace)[0] + suffix; }
  } else {
    prefix += newLine + prevLine.match(leadingWhitespace)[0];
  }
  selected = '';
  if (suffix === '') { suffix = newLine; }
  return { prefix: prefix, selected: selected, suffix: suffix }
};

var autoOpen = function (opening, closing, prefix, selected, suffix) {
  prefix += opening;
  suffix = closing + suffix;
  return { prefix: prefix, selected: selected, suffix: suffix }
};

var autoStrip = function (prefix, selected, suffix) {
  prefix = prefix.slice(0, -1);
  suffix = suffix.slice(1);
  return { prefix: prefix, selected: selected, suffix: suffix }
};

// content in selection is handled in index.js
var testAutoStrip = function (pairs, prefix, selected, suffix) {
  var result = false;
  pairs.forEach(function (ref) {
    var opening = ref[0];
    var closing = ref[1];

    closing = closing ? closing : opening;
    if (prefix.slice(-1) === opening && suffix.charAt(0) === closing) { result = true; }
  });
  return result
};

var overwrite = function (closing, prefix, selected, suffix) {
  prefix += closing;
  suffix = suffix.slice(1);
  return { prefix: prefix, selected: selected, suffix: suffix }
};

// content in selection is handled in index.js
var testOverwrite = function (closing, prefix, selected, suffix) {
  return suffix.charAt(0) === closing
};

var tabIndent = function (newLine, tab, prefix, selected, suffix) {
  var prefLines = prefix.split(onNewLine);
  var prevLine = prefLines.splice(-1)[0];

  if (selected === '') {
    if (tab === '\t' || prevLine.length % tab.length === 0) {
      prefix += tab;
    } else {
      prefix += ' '.repeat(tab.length - prevLine.length % tab.length);
    }
  } else {
    prevLine = tab + prevLine;
    prefix = prefLines.concat(prevLine).join(newLine);
    selected = selected.replace(allNewLines, newLine + tab);
  }
  return { prefix: prefix, selected: selected, suffix: suffix }
};

var tabUnindent = function (newLine, tab, prefix, selected, suffix) {
  var lines = selected.split(onNewLine);
  var prevLine = prefix.split(onNewLine).splice(-1)[0];

  if (lines.length === 1) {
    if (prefix.endsWith(tab))
      { prefix = prefix.slice(0, -tab.length); }
    else { // indent instead
      if (tab === '\t' || prevLine.length % tab.length === 0) {
        prefix += tab;
      } else {
        prefix += ' '.repeat(tab.length - prevLine.length % tab.length);
      }
    }
  } else {
    var prevLength = prevLine.length;
    if (prevLength) {
      prevLine = removeIfStartsWith(tab)(prevLine);
      prefix = prefix.slice(0, -prevLength) + prevLine;
    }
    lines = lines.map(removeIfStartsWith(tab));
    selected = lines.join(newLine);
  }
  return { prefix: prefix, selected: selected, suffix: suffix }
};

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

var Misbehave = (function (Editable$$1) {
  function Misbehave(elem, opts) {
    if ( opts === void 0 ) opts = {};

    if (typeof opts.store === 'undefined') { opts.store = store(getSections(elem)); }
    if (typeof opts.behavior === 'undefined') { opts.behavior = StrUtil; }

    Editable$$1.call(this, elem, opts);
  }

  if ( Editable$$1 ) Misbehave.__proto__ = Editable$$1;
  Misbehave.prototype = Object.create( Editable$$1 && Editable$$1.prototype );
  Misbehave.prototype.constructor = Misbehave;

  return Misbehave;
}(Editable));

return Misbehave;

})));
