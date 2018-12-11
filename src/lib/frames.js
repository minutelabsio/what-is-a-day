(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Frames"] = factory();
	else
		root["Frames"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/easing-functions/index.js":
/*!************************************************!*\
  !*** ./node_modules/easing-functions/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
* A collection of easing methods defining ease-in ease-out curves.
*
* @class Easing
*/
var Easing = module.exports = {

    /**
    * Linear easing.
    *
    * @class Easing.Linear
    */
    Linear: {

        /**
        * Ease-in.
        *
        * @method Easing.Linear#In
        * @param {number} k - The value to be tweened.
        * @returns {number} k^2.
        */
        None: function ( k ) {

            return k;

        }

    },

    /**
    * Quadratic easing.
    *
    * @class Easing.Quadratic
    */
    Quadratic: {

        /**
        * Ease-in.
        *
        * @method Easing.Quadratic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} k^2.
        */
        In: function ( k ) {

            return k * k;

        },

        /**
        * Ease-out.
        *
        * @method Easing.Quadratic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} k* (2-k).
        */
        Out: function ( k ) {

            return k * ( 2 - k );

        },

        /**
        * Ease-in/out.
        *
        * @method Easing.Quadratic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
            return - 0.5 * ( --k * ( k - 2 ) - 1 );

        }

    },

    /**
    * Cubic easing.
    *
    * @class Easing.Cubic
    */
    Cubic: {

        /**
        * Cubic ease-in.
        *
        * @method Easing.Cubic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k;

        },

        /**
        * Cubic ease-out.
        *
        * @method Easing.Cubic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return --k * k * k + 1;

        },

        /**
        * Cubic ease-in/out.
        *
        * @method Easing.Cubic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );

        }

    },

    /**
    * Quartic easing.
    *
    * @class Easing.Quartic
    */
    Quartic: {

        /**
        * Quartic ease-in.
        *
        * @method Easing.Quartic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k * k;

        },

        /**
        * Quartic ease-out.
        *
        * @method Easing.Quartic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return 1 - ( --k * k * k * k );

        },

        /**
        * Quartic ease-in/out.
        *
        * @method Easing.Quartic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

        }

    },

    /**
    * Quintic easing.
    *
    * @class Easing.Quintic
    */
    Quintic: {

        /**
        * Quintic ease-in.
        *
        * @method Easing.Quintic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k * k * k * k * k;

        },

        /**
        * Quintic ease-out.
        *
        * @method Easing.Quintic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return --k * k * k * k * k + 1;

        },

        /**
        * Quintic ease-in/out.
        *
        * @method Easing.Quintic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

        }

    },

    /**
    * Sinusoidal easing.
    *
    * @class Easing.Sinusoidal
    */
    Sinusoidal: {

        /**
        * Sinusoidal ease-in.
        *
        * @method Easing.Sinusoidal#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Math.cos( k * Math.PI / 2 );

        },

        /**
        * Sinusoidal ease-out.
        *
        * @method Easing.Sinusoidal#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return Math.sin( k * Math.PI / 2 );

        },

        /**
        * Sinusoidal ease-in/out.
        *
        * @method Easing.Sinusoidal#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

        }

    },

    /**
    * Exponential easing.
    *
    * @class Easing.Exponential
    */
    Exponential: {

        /**
        * Exponential ease-in.
        *
        * @method Easing.Exponential#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return k === 0 ? 0 : Math.pow( 1024, k - 1 );

        },

        /**
        * Exponential ease-out.
        *
        * @method Easing.Exponential#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

        },

        /**
        * Exponential ease-in/out.
        *
        * @method Easing.Exponential#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
            return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

        }

    },

    /**
    * Circular easing.
    *
    * @class Easing.Circular
    */
    Circular: {

        /**
        * Circular ease-in.
        *
        * @method Easing.Circular#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Math.sqrt( 1 - k * k );

        },

        /**
        * Circular ease-out.
        *
        * @method Easing.Circular#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            return Math.sqrt( 1 - ( --k * k ) );

        },

        /**
        * Circular ease-in/out.
        *
        * @method Easing.Circular#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

        }

    },

    /**
    * Elastic easing.
    *
    * @class Easing.Elastic
    */
    Elastic: {

        /**
        * Elastic ease-in.
        *
        * @method Easing.Elastic#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

        },

        /**
        * Elastic ease-out.
        *
        * @method Easing.Elastic#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

        },

        /**
        * Elastic ease-in/out.
        *
        * @method Easing.Elastic#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

        }

    },

    /**
    * Back easing.
    *
    * @class Easing.Back
    */
    Back: {

        /**
        * Back ease-in.
        *
        * @method Easing.Back#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );

        },

        /**
        * Back ease-out.
        *
        * @method Easing.Back#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1;

        },

        /**
        * Back ease-in/out.
        *
        * @method Easing.Back#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

        }

    },

    /**
    * Bounce easing.
    *
    * @class Easing.Bounce
    */
    Bounce: {

        /**
        * Bounce ease-in.
        *
        * @method Easing.Bounce#In
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        In: function ( k ) {

            return 1 - Easing.Bounce.Out( 1 - k );

        },

        /**
        * Bounce ease-out.
        *
        * @method Easing.Bounce#Out
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        Out: function ( k ) {

            if ( k < ( 1 / 2.75 ) ) {

                return 7.5625 * k * k;

            } else if ( k < ( 2 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

            } else if ( k < ( 2.5 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

            } else {

                return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

            }

        },

        /**
        * Bounce ease-in/out.
        *
        * @method Easing.Bounce#InOut
        * @param {number} k - The value to be tweened.
        * @returns {number} The tweened value.
        */
        InOut: function ( k ) {

            if ( k < 0.5 ) return Easing.Bounce.In( k * 2 ) * 0.5;
            return Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

        }

    }

};

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./src/animation/smoothener.js":
/*!*************************************!*\
  !*** ./src/animation/smoothener.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Smoothener = Smoothener;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _easingFunctions = _interopRequireDefault(__webpack_require__(/*! easing-functions */ "./node_modules/easing-functions/index.js"));

var _transition = __webpack_require__(/*! @/transition */ "./src/transition.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Helper to smooth state changes
// let smooth = Smoothener( frames )
// smooth.setState( state ) // when state changed
// state = smooth.update() // when animation frame
// ---------------------------------------
function Smoothener(manager) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 80 : _ref$duration,
      _ref$keys = _ref.keys,
      keys = _ref$keys === void 0 ? null : _ref$keys,
      _ref$easing = _ref.easing,
      easing = _ref$easing === void 0 ? _easingFunctions.default.Cubic.Out : _ref$easing;

  var state = manager.state;
  var targetState = state;
  var startState = state;
  var startTime = 0;
  var endTime = -1;
  var lastTime;
  var smoothener = {
    duration: duration,
    easing: easing,

    get state() {
      return state;
    }

  };

  smoothener.setState = function (newState) {
    var now = _util.default.now();

    startTime = lastTime || now;
    endTime = startTime + smoothener.duration;
    targetState = _util.default.pick(newState, keys);
    startState = _objectSpread({}, state);
  };

  smoothener.update = function () {
    var now = _util.default.now();

    if (now > endTime) {
      lastTime = now;
      state = targetState;
      return state;
    }

    if (lastTime === now) {
      return state;
    }

    lastTime = now;
    var timeFraction = (0, _transition.getTimeFraction)(startTime, endTime, now);
    state = (0, _transition.getInterpolatedState)(manager._schema, startState, targetState, timeFraction, smoothener.easing);
    return state;
  };

  return smoothener;
}

/***/ }),

/***/ "./src/event-emitter.js":
/*!******************************!*\
  !*** ./src/event-emitter.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaultPriority = 1;

function getPriority(val) {
  return val._priority_;
}

var EventEmitter =
/*#__PURE__*/
function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    // ensure topics hash is initialized
    this._topics = this._topics || (this._topics = {});
  }
  /**
  * EventEmitter#on( topic, fn( data, event )[, scope, priority] ) -> this
  * EventEmitter#on( topicConfig[, scope, priority] ) -> this
  * - topic (String): The topic name
  * - topicConfig (Object): A config with key/value pairs of `{ topic: callbackFn, ... }`
  * - fn (Function): The callback function (if not using Object as previous argument)
  * - data (Mixed): The data sent from the call to `.emit()`
  * - event (Object): Event data, holding `.topic`, the topic, and `.handler`, the `fn` callback.
  * - scope (Object): The scope to bind callback to
  * - priority (Number): The priority of the callback (higher is earlier)
  *
  * Subscribe callback(s) to a topic(s).
  **/


  _createClass(EventEmitter, [{
    key: "on",
    value: function on(topic, fn, scope, priority) {
      var listeners;
      var orig;
      var idx; // check if we're subscribing to multiple topics
      // with an object

      if (_typeof(topic) === 'object') {
        for (var t in topic) {
          this.on(t, topic[t], fn, scope);
        }

        return this;
      }

      listeners = this._topics[topic] || (this._topics[topic] = []);
      orig = fn;

      if (_typeof(scope) === 'object') {
        fn = fn.bind(scope);
        fn._bindfn_ = orig;
        fn._one_ = orig._one_;
        fn._scope_ = scope;
      } else if (priority === undefined) {
        priority = scope;
      }

      fn._priority_ = priority === undefined ? defaultPriority : priority;
      idx = _util.default.sortedIndex(listeners, fn, getPriority);
      listeners.splice(idx, 0, fn);
      return this;
    }
    /**
    * EventEmitter#off( topic, fn[, scope] ) -> this
    * EventEmitter#off( topicCfg ) -> this
    * - topic (String): topic The topic name. Specify `true` to remove all listeners for all topics
    * - topicCfg (Object): A config with key/value pairs of `{ topic: callbackFn, ... }`
    * - fn (Function): The original callback function. Specify `true` to remove all listeners for specified topic
    * - scope (Object): The scope the callback was bound to. This is important if you are
    *   binding methods that come from object prototypes.
    *
    * Unsubscribe callback(s) from topic(s).
    **/

  }, {
    key: "off",
    value: function off(topic, fn, scope) {
      var listeners;
      var listn;

      if (topic === true) {
        // purge all listeners
        this._topics = {};
        return this;
      } // check if we're subscribing to multiple topics
      // with an object


      if (_typeof(topic) === 'object') {
        for (var t in topic) {
          this.off(t, topic[t]);
        }

        return this;
      }

      listeners = this._topics[topic];

      if (!listeners) {
        return this;
      }

      if (fn === true) {
        // purge all listeners for topic
        this._topics[topic] = [];
        return this;
      }

      for (var i = 0, l = listeners.length; i < l; i++) {
        listn = listeners[i];

        if ((listn._bindfn_ === fn || listn === fn) && (!scope || listn._scope_ === scope) // check the scope too if specified
        ) {
            listeners.splice(i, 1);
            break;
          }
      }

      return this;
    }
    /**
    * EventEmitter#emit( topic[, data] ) -> this
    * - topic (String): The topic name
    * - data (Mixed): The data to send
    *
    * Publish data to a topic.
    **/

  }, {
    key: "emit",
    value: function emit(topic, data) {
      var listeners = this._topics[topic];
      var l = listeners && listeners.length;
      var handler;
      var e;

      if (!l) {
        return this;
      }

      e = {}; // event data

      e.topic = topic;
      e.handler = handler; // reverse iterate so priorities work out correctly

      while (l--) {
        handler = listeners[l];
        handler(data, e); // if _one_ flag is set, the unsubscribe

        if (handler._one_) {
          listeners.splice(l, 1);
        }
      }

      return this;
    }
    /**
    * EventEmitter#one( topic, fn( data, event )[, scope, priority] ) -> this
    * EventEmitter#one( topicConfig[, scope, priority] ) -> this
    * - topic (String): The topic name
    * - topicConfig (Object): A config with key/value pairs of `{ topic: callbackFn, ... }`
    * - fn (Function): The callback function (if not using Object as previous argument)
    * - data (Mixed): The data sent from the call to `.emit()`
    * - event (Object): Event data, holding `.topic`, the topic, and `.handler`, the `fn` callback.
    * - scope (Object): The scope to bind callback to
    * - priority (Number): The priority of the callback (higher is earlier)
    *
    * Subscribe callback(s) to a topic(s), but only ONCE.
    **/

  }, {
    key: "one",
    value: function one(topic, fn, scope) {
      // check if we're subscribing to multiple topics
      // with an object
      if (_typeof(topic) === 'object') {
        for (var t in topic) {
          this.one(t, topic[t], fn, scope);
        }

        return this;
      } // set the _one_ flag


      fn._one_ = true;
      this.on(topic, fn, scope);
      return this;
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;
module.exports = exports.default;

/***/ }),

/***/ "./src/frame.js":
/*!**********************!*\
  !*** ./src/frame.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFrame = createFrame;

var _time = __webpack_require__(/*! @/parsers/time */ "./src/parsers/time.js");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_FRAME_META = {
  time: 0
};
var META_PARSERS = {
  time: _time.timeParser,
  duration: _time.timeParser // parse meta to standardized format

};

function parseMeta(meta, defaults) {
  var ret = _objectSpread({}, defaults, meta); // clone


  for (var key in META_PARSERS) {
    ret[key] = META_PARSERS[key](ret[key]);
  }

  return ret;
}

function createFrame(state, meta, defaultMetaOptions) {
  if (!state) {
    throw new Error('Can not create frame without state');
  }

  state = _objectSpread({}, state);
  meta = parseMeta(meta || state.$meta, _objectSpread({}, defaultMetaOptions, DEFAULT_FRAME_META));
  delete state.$meta;

  if (!meta.duration) {
    meta.duration = meta.time - meta.startTime;
  }

  if (!meta.startTime) {
    meta.startTime = meta.time - meta.duration;
  }

  return {
    state: state,
    meta: meta
  };
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _easingFunctions = _interopRequireDefault(__webpack_require__(/*! easing-functions */ "./node_modules/easing-functions/index.js"));

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _manager = _interopRequireDefault(__webpack_require__(/*! @/manager */ "./src/manager.js"));

var _interpolators = _interopRequireDefault(__webpack_require__(/*! @/interpolators */ "./src/interpolators.js"));

var _player = _interopRequireDefault(__webpack_require__(/*! @/player */ "./src/player.js"));

var _smoothener = __webpack_require__(/*! @/animation/smoothener */ "./src/animation/smoothener.js");

var _type = __webpack_require__(/*! @/type */ "./src/type.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Frames = function Frames(schema, meta) {
  return new _manager.default(schema, meta);
};

Frames.Util = _util.default;
Frames.Easing = _easingFunctions.default;
Frames.Interpolators = _interpolators.default;
Frames.Player = _player.default;
Frames.registerType = _type.registerType;
Frames.Animation = {
  Smoothener: _smoothener.Smoothener
};
var _default = Frames;
exports.default = _default;
module.exports = exports.default;

/***/ }),

/***/ "./src/interpolators.js":
/*!******************************!*\
  !*** ./src/interpolators.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pi2 = Math.PI * 2;

function shortestAngleDist(a0, a1) {
  var da = (a1 - a0) % Pi2;
  return (da - Math.PI) % Pi2 + Math.PI;
}

function toCharCodes(str) {
  return str.split('').map(function (c) {
    return c.charCodeAt();
  });
}

var Interpolators = {
  Linear: function Linear(from, to, t) {
    return from * (1 - t) + to * t;
  },
  Angle: function Angle(from, to, t) {
    return from + shortestAngleDist(from, to) * t;
  },
  Array: function Array(from, to, t) {
    return to.map(function (v1, idx) {
      return Interpolators.Linear(from[idx], v1, t);
    });
  },
  Object: function Object(from, to, t) {
    return _util.default.mapProperties(from, function (val, key) {
      return Interpolators.Linear(val, to[key], t);
    });
  },
  String: function String(from, to, t) {
    return Interpolators.Array(toCharCodes(from), toCharCodes(to), t).join('');
  },
  Step: function Step(from, to, t) {
    return t > 0.5 ? to : from;
  }
};
var _default = Interpolators;
exports.default = _default;
module.exports = exports.default;

/***/ }),

/***/ "./src/manager.js":
/*!************************!*\
  !*** ./src/manager.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _easingFunctions = _interopRequireDefault(__webpack_require__(/*! easing-functions */ "./node_modules/easing-functions/index.js"));

var _schema = __webpack_require__(/*! @/schema */ "./src/schema.js");

var _transition = __webpack_require__(/*! @/transition */ "./src/transition.js");

var _frame = __webpack_require__(/*! @/frame */ "./src/frame.js");

var _time = __webpack_require__(/*! @/parsers/time */ "./src/parsers/time.js");

var _timeline = __webpack_require__(/*! @/timeline */ "./src/timeline.js");

var _eventEmitter = _interopRequireDefault(__webpack_require__(/*! @/event-emitter */ "./src/event-emitter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DEFAULT_OPTIONS = {
  defaultTransitionDuration: 1000,
  meddleTimeout: 2000,
  meddleRelaxDuration: 500,
  meddleRelaxDelay: 1000
};

var _default =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(_default, _EventEmitter);

  function _default(schema, options) {
    var _this;

    _classCallCheck(this, _default);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this));
    _this.time = 0;
    _this.framesById = {};
    _this.frames = [];
    _this.timeline = [];
    _this._schema = (0, _schema.createSchema)(schema);
    _this._defaultState = (0, _schema.createState)(_this._schema);
    _this._state = _objectSpread({}, _this._defaultState);
    _this._prevState = _objectSpread({}, _this._defaultState);
    _this.options = Object.assign({}, DEFAULT_OPTIONS, options); // reset

    _this.unmeddle();

    return _this;
  }

  _createClass(_default, [{
    key: "add",
    // add a frame
    value: function add(state, meta) {
      var frame = (0, _frame.createFrame)(state, meta, {
        duration: this.options.defaultTransitionDuration
      });

      if (frame.meta.id && this.framesById[frame.meta.id]) {
        throw new Error("Frame with id \"".concat(frame.meta.id, "\" already defined"));
      } // add to id list


      if (frame.meta.id) {
        this.framesById[frame.meta.id] = frame;
      }

      this.frames.push(frame);
      this.refreshTimeline();

      this._updateState();

      return this;
    }
  }, {
    key: "refreshTimeline",
    value: function refreshTimeline() {
      this.timeline = (0, _timeline.createTimeline)(this._schema, this.frames);
      return this;
    } // toggle user meddling

  }, {
    key: "meddle",
    value: function meddle(meddleState) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          relaxDuration = _ref.relaxDuration,
          relaxDelay = _ref.relaxDelay,
          freeze = _ref.freeze,
          easing = _ref.easing,
          transitionDuration = _ref.transitionDuration;

      relaxDelay = relaxDelay !== undefined ? relaxDelay : this.options.meddleRelaxDelay;
      relaxDuration = relaxDuration !== undefined ? relaxDuration : this.options.meddleRelaxDuration;
      this._meddle.state = _objectSpread({}, this._meddle.state, meddleState);
      this._meddle.startTime = false;
      this._meddle.relaxState = null;
      this._meddle.active = true;
      this._meddle.freeze = freeze;
      this._meddle.relaxDelay = relaxDelay;
      this._meddle.relaxDuration = relaxDuration;
      this._meddle.easing = easing || _easingFunctions.default.Linear.None;

      this._updateState();

      return this;
    } // force meddling to reset

  }, {
    key: "unmeddle",
    value: function unmeddle() {
      this._meddle = {
        state: {}
      };
      return this;
    }
  }, {
    key: "getFrame",
    value: function getFrame(id) {
      var frame = this.framesById[id];

      if (!frame) {
        throw new Error("No frame with id \"".concat(id, "\" exists to be inherited"));
      }

      return frame;
    }
  }, {
    key: "seek",
    value: function seek(time) {
      time = (0, _time.timeParser)(time);
      this.time = time;

      this._updateState();

      this.emit('seek');
      return this;
    }
  }, {
    key: "_updateState",
    value: function _updateState() {
      var state = this.getStateAt(this.time);
      state = this._assignMeddleState(state); // set state

      this._prevState = this._state;
      this._state = state;
      this.emit('update');
    }
  }, {
    key: "_assignMeddleState",
    value: function _assignMeddleState(state) {
      // check meddling
      if (!this._meddle.active) {
        return state;
      }

      var meddle = this._meddle;

      if (meddle.freeze) {
        return Object.assign(state, meddle.state);
      }

      if (meddle.startTime === false) {
        meddle.startTime = this.time;
        meddle.endTime = meddle.startTime + meddle.relaxDelay + meddle.relaxDuration;
        meddle.relaxState = _util.default.pick(this.getStateAt(meddle.endTime), Object.keys(meddle.state));
      }

      if (this.time >= meddle.endTime || this.time < meddle.startTime) {
        // meddling is over
        this.unmeddle();
      }

      if (this.time > this.totalTime) {
        // this will force a reset when the timeline is re-entered
        this.unmeddle();
      }

      var timeFraction = (0, _transition.getTimeFraction)(meddle.startTime + meddle.relaxDelay, meddle.endTime, this.time);
      var meddleTransitionState = (0, _transition.getInterpolatedState)(this._schema, meddle.state, _util.default.mergeIntersecting(meddle.relaxState, state), timeFraction, meddle.easing);
      Object.assign(state, meddleTransitionState);
      return state;
    }
  }, {
    key: "getStateAt",
    value: function getStateAt(time) {
      if (time >= this.totalTime) {
        var m = this.timeline[this.timeline.length - 1];
        var t = m.transition;
        return _objectSpread({}, m.state, t.relaxState);
      }

      var transitions = (0, _timeline.getTransitionsAtTime)(this.timeline, time);
      var startState = (0, _timeline.getStartState)(this.timeline, time, this._defaultState);
      return (0, _timeline.reduceTransitions)(this._schema, transitions, time, startState);
    }
  }, {
    key: "to",
    value: function to(frameId) {
      var frame = this.getFrame(frameId);
      return this.seek(frame.meta.time);
    }
  }, {
    key: "next",
    value: function next() {// transition like slideshow
    }
  }, {
    key: "back",
    value: function back() {// transition back like slideshow
    }
  }, {
    key: "getTransitions",
    value: function getTransitions(time) {
      time = time || this.time;
      return (0, _timeline.getTransitionsAtTime)(this.timeline, time);
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "totalTime",
    get: function get() {
      return this.timeline[this.timeline.length - 1].time;
    }
  }, {
    key: "progress",
    get: function get() {
      return (this.time / this.totalTime * 100).toFixed(2);
    }
  }]);

  return _default;
}(_eventEmitter.default);

exports.default = _default;
module.exports = exports.default;

/***/ }),

/***/ "./src/parsers/time.js":
/*!*****************************!*\
  !*** ./src/parsers/time.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeParser = timeParser;
var timeDecReg = /([0-9.]+)(s|m|h)?/;
var timeStdReg = /((\d\d):)?((\d\d):(\d\d))/;
var MINUTES = 60;
var HOURS = 60 * 60;

function getTime(h, m, s) {
  h = parseFloat(h || 0);
  m = parseFloat(m || 0);
  s = parseFloat(s || 0);
  return Math.round((h * HOURS + m * MINUTES + s) * 1000); // integer
} // returns parsed time in ms


function timeParser(strOrNumber) {
  if (typeof strOrNumber !== 'string') {
    return strOrNumber;
  }

  var parsed = strOrNumber.match(timeStdReg);

  if (parsed) {
    return getTime(parsed[2], parsed[4], parsed[5]);
  }

  parsed = strOrNumber.match(timeDecReg);

  if (parsed) {
    var unit = ('' + parsed[2]).toLowerCase();

    if (!parsed[1] || unit === 's') {
      return getTime(0, 0, parsed[1]);
    }

    if (unit === 'm') {
      return getTime(0, parsed[1], 0);
    }

    if (unit === 'h') {
      return getTime(parsed[1], 0, 0);
    }
  }

  return 0;
}

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _time = __webpack_require__(/*! @/parsers/time */ "./src/parsers/time.js");

var _eventEmitter = _interopRequireDefault(__webpack_require__(/*! @/event-emitter */ "./src/event-emitter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var PlayerStack = [];

function step() {
  window.requestAnimationFrame(step);

  var now = _util.default.now();

  for (var l = PlayerStack.length, i = 0; i < l; i++) {
    PlayerStack[i].step(now);
  }
}

step();

var Player =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Player, _EventEmitter);

  function Player() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        totalTime = _ref.totalTime,
        _ref$playbackRate = _ref.playbackRate,
        playbackRate = _ref$playbackRate === void 0 ? 1 : _ref$playbackRate;

    _classCallCheck(this, Player);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this));

    if (!totalTime) {
      throw new Error('Player: "totalTime" not set');
    }

    _this.totalTime = (0, _time.timeParser)(totalTime);
    _this.clockTime = _util.default.now();
    _this.time = 0;
    _this.playbackRate = playbackRate;
    _this.paused = true;
    PlayerStack.push(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Player, [{
    key: "togglePause",
    value: function togglePause(paused) {
      if (paused === undefined) {
        paused = !this.paused;
      }

      this.paused = !!paused;

      if (this.paused) {
        this.emit('pause');
      } else {
        this.emit('play');
      }

      this.emit('togglePause');
      return this;
    }
  }, {
    key: "seek",
    value: function seek(time) {
      this.time = time;
      this.emit('update', time);
      this.emit('seek', time);
      return this;
    }
  }, {
    key: "step",
    value: function step(now) {
      var clockTime = this._clockTime;
      var playbackRate = this.playbackRate;
      var dt = now - clockTime;
      var time = this.time;
      var totalTime = this.totalTime;
      this._clockTime = now;
      this.emit('animate', now); // if it's paused, don't step

      if (this.paused) {
        return this;
      }

      time += dt * playbackRate;

      if (time >= totalTime) {
        time = totalTime;
        this.togglePause(true);
      }

      this.time = time;
      this.emit('update', time);
      this.emit('playback', time);
      return this;
    }
  }, {
    key: "progress",
    get: function get() {
      return (this.time / this.totalTime * 100).toFixed(2);
    }
  }]);

  return Player;
}(_eventEmitter.default);

function _default(config) {
  return new Player(config);
}

module.exports = exports.default;

/***/ }),

/***/ "./src/schema.js":
/*!***********************!*\
  !*** ./src/schema.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSchema = createSchema;
exports.createState = createState;

var _easingFunctions = _interopRequireDefault(__webpack_require__(/*! easing-functions */ "./node_modules/easing-functions/index.js"));

var _type = __webpack_require__(/*! @/type */ "./src/type.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var DEFAULT_EASING = _easingFunctions.default.Linear.None;

function createSchema(schemaDef) {
  var schema = {};
  var props = Object.keys(schemaDef);

  for (var _i = 0; _i < props.length; _i++) {
    var prop = props[_i];
    var def = schemaDef[prop];
    var easing = DEFAULT_EASING;
    var interpolator = null;
    var type = void 0;
    var cfg = void 0;
    var defaultVal = void 0;

    if (_typeof(def) === 'object' && def.type !== undefined) {
      type = (0, _type.getType)(def.type);
      cfg = (0, _type.getTypeCfg)(type);

      if (!cfg) {
        throw new Error("Unrecognized type ".concat(type));
      }

      if ((0, _type.isExplicit)(type, def.type)) {
        defaultVal = def.default || cfg.default;
      } else {
        defaultVal = def.type;
      }

      easing = def.easing || DEFAULT_EASING;
      interpolator = def.interpolator || cfg.interpolator;
    } else {
      if (typeof def === 'string') {
        type = 'string';
      } else {
        type = (0, _type.getType)(def);
      }

      cfg = (0, _type.getTypeCfg)(type);

      if (!cfg) {
        throw new Error("Unrecognized type ".concat(type));
      }

      easing = def.easing || DEFAULT_EASING;
      interpolator = cfg.interpolator;
      defaultVal = (0, _type.isExplicit)(type, def) ? cfg.default : def;
    }

    schema[prop] = {
      type: type,
      easing: easing,
      default: defaultVal,
      interpolator: interpolator,
      def: def
    };
  }

  return schema;
}

function createState(schema) {
  var state = {};
  var props = Object.keys(schema);

  for (var _i2 = 0; _i2 < props.length; _i2++) {
    var prop = props[_i2];
    state[prop] = schema[prop].default;
  }

  return state;
}

/***/ }),

/***/ "./src/timeline.js":
/*!*************************!*\
  !*** ./src/timeline.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeline = createTimeline;
exports.getTransitionsAtTime = getTransitionsAtTime;
exports.getStartState = getStartState;
exports.reduceTransitions = reduceTransitions;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _schema = __webpack_require__(/*! @/schema */ "./src/schema.js");

var _transition = __webpack_require__(/*! @/transition */ "./src/transition.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Check for conflicting overlaps
// ---------------------------------------
function getConflictingFrames(timeline) {
  var markers = [];
  var idx;

  for (var l = timeline.length, i = 0; i < l; i++) {
    var m = timeline[i];

    if (m.type === 'start') {
      markers.push(m);
    } else {
      // stop tracking its partner
      idx = markers.indexOf(m.start);
      markers.splice(idx, 1);
    }

    for (var _l = markers.length, _i = 0; _i < _l; _i++) {
      var _m = markers[_i];

      for (var j = _i + 1; j < _l; j++) {
        var paths = _util.default.getIntersectingPaths(_m.transition.endState, markers[j].transition.endState);

        if (paths.length) {
          return {
            paths: paths,
            frames: [_m.frame, markers[j].frame]
          };
        }
      }
    }
  }

  return false;
} // Create a timeline array from specified frames
// ---------------------------------------


function createTimeline(schema) {
  var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!frames.length) {
    return [];
  }

  var getTime = function getTime(v) {
    return v.time;
  };

  var defaultState = (0, _schema.createState)(schema);
  var timeline = [];
  frames.forEach(function (frame) {
    var idx;
    var start = {
      type: 'start',
      frame: frame,
      time: frame.meta.time - frame.meta.duration
    };
    var end = {
      type: 'end',
      frame: frame,
      time: frame.meta.time
    };
    start.end = end;
    end.start = start;
    idx = _util.default.sortedIndex(timeline, start, getTime);
    timeline.splice(idx, 0, start);
    idx = _util.default.sortedIndex(timeline, end, getTime);
    timeline.splice(idx, 0, end);
  });
  timeline.sort(function (a, b) {
    if (a.time === b.time) {
      return a.type > b.type ? 1 : -1;
    }

    return 0;
  });
  var prevState = defaultState; // assign inherited states

  timeline.forEach(function (m, idx) {
    // only go through ends
    if (m.type !== 'end') {
      return;
    }

    var transition = (0, _transition.createTransitionFromFrame)(m.frame, prevState);
    m.transition = transition;
    m.start.transition = transition;
    prevState = _objectSpread({}, prevState, transition.endState);
  });
  prevState = defaultState; // assign a reduced end state to each marker

  timeline.forEach(function (m) {
    if (m.type !== 'end') {
      return;
    }

    var transitions = getTransitionsAtTime(timeline, m.time);
    prevState = reduceTransitions(schema, transitions, m.time, prevState);
    m.state = prevState;
  });
  var conflicts = getConflictingFrames(timeline);

  if (conflicts) {
    throw new Error('The following overlapping frames modify the same state paths:\n' + "paths: ".concat(conflicts.paths, "\n") + "frames: ".concat(JSON.stringify(conflicts.frames, null, 2)));
  }

  return timeline;
} // Get transition information needed
// at specified time from timeline
// ---------------------------------------


function getTransitionsAtTime(timeline, time) {
  var markers = [];
  var idx;

  for (var l = timeline.length, i = 0; i < l; i++) {
    var m = timeline[i];

    if (m.time >= time) {
      break;
    }

    if (m.type === 'start') {
      markers.push(m);
    } else {
      // stop tracking its partner
      idx = markers.indexOf(m.start);
      markers.splice(idx, 1);
    }
  }

  return markers.map(function (a) {
    return a.transition;
  });
} // Get the cached complete state at the
// last end marker
// ---------------------------------------


function getStartState(timeline, time, defaultState) {
  var state = defaultState;

  for (var l = timeline.length, i = 0; i < l; i++) {
    var m = timeline[i];

    if (m.time > time) {
      return state;
    }

    if (m.type === 'end') {
      state = m.state;
    }
  }

  return state;
} // Get final state from transitions
// ---------------------------------------


function reduceTransitions(schema) {
  var transitions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var initialState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return transitions.reduce(function (state, tr) {
    var progress = (0, _transition.getTimeFraction)(tr.startTime, tr.endTime, time);
    return Object.assign(state, (0, _transition.getInterpolatedState)(schema, tr.startState, tr.endState, progress, tr.easing));
  }, _objectSpread({}, initialState));
}

/***/ }),

/***/ "./src/transition.js":
/*!***************************!*\
  !*** ./src/transition.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransitionFromFrame = createTransitionFromFrame;
exports.interpolateProperty = interpolateProperty;
exports.getInterpolatedState = getInterpolatedState;
exports.getTimeFraction = getTimeFraction;

var _util = _interopRequireDefault(__webpack_require__(/*! @/util */ "./src/util/index.js"));

var _easingFunctions = _interopRequireDefault(__webpack_require__(/*! easing-functions */ "./node_modules/easing-functions/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createTransitionFromFrame(frame, previousState) {
  var startTime = frame.meta.time - frame.meta.duration;
  var endTime = frame.meta.time;
  var endState = frame.state;

  var startState = _util.default.pick(previousState, Object.keys(endState));

  var easing = frame.meta.easing || _easingFunctions.default.Linear.None;
  return {
    startTime: startTime,
    endTime: endTime,
    startState: startState,
    endState: endState,
    easing: easing,
    frame: frame
  };
}

function interpolateProperty(fn, from, to, progress) {
  return fn(from, to, progress);
}

function getInterpolatedState(schema, startState, endState, timeFraction, easing) {
  if (timeFraction <= 0) {
    return _objectSpread({}, startState);
  }

  if (timeFraction >= 1) {
    return _objectSpread({}, endState);
  }

  var nextState = _objectSpread({}, startState);

  for (var prop in endState) {
    var def = schema[prop];
    var val = void 0;

    if (!def) {
      // not specified in schema. just set
      val = endState[prop];
    } else {
      var progress = easing(timeFraction);
      val = interpolateProperty(def.interpolator, nextState[prop], endState[prop], progress);
    }

    nextState[prop] = val;
  }

  return nextState;
}

function getTimeFraction(startTime, endTime, time) {
  var duration = endTime - startTime;
  return _util.default.clamp(0, 1, (time - startTime) / duration);
}

/***/ }),

/***/ "./src/type.js":
/*!*********************!*\
  !*** ./src/type.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerType = registerType;
exports.getType = getType;
exports.isExplicit = isExplicit;
exports.getTypeCfg = getTypeCfg;
exports.NATIVE_TYPES = void 0;

var _interpolators = _interopRequireDefault(__webpack_require__(/*! @/interpolators */ "./src/interpolators.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var NATIVE_TYPES = {
  'number': {
    type: 'number',
    default: 0,
    interpolator: _interpolators.default.Linear
  },
  'string': {
    type: 'string',
    default: '',
    interpolator: _interpolators.default.String
  },
  'boolean': {
    type: 'boolean',
    default: false,
    interpolator: _interpolators.default.Switch
  },
  'array': {
    type: 'array',
    default: [],
    interpolator: _interpolators.default.Array
  },
  'object': {
    type: 'object',
    default: {},
    interpolator: _interpolators.default.Object
  }
};
exports.NATIVE_TYPES = NATIVE_TYPES;
var CUSTOM_TYPES = {};

function registerType(cfg) {
  var type = cfg.type,
      interpolator = cfg.interpolator;

  if (!type || !interpolator) {
    throw new Error('Custom types must have "type" and "interpolator" specified');
  }

  if (CUSTOM_TYPES[type]) {
    throw new Error("Custom type \"".concat(type, "\" is already registered"));
  }

  CUSTOM_TYPES[type] = {
    type: type,
    interpolator: interpolator,
    default: cfg.default
  };
}

function getType(val) {
  var type = _typeof(val);

  if (type === 'string') {
    return val;
  }

  if (val === Number || type === 'number') {
    return 'number';
  }

  if (val === Boolean || type === 'boolean') {
    return 'boolean';
  }

  if (val === String) {
    return 'string';
  }

  if (val === Array || Array.isArray(val)) {
    return 'array';
  }

  if (val === Object) {
    return 'object';
  }

  if (type === 'object') {
    throw new Error('Can not use implicit definition for objects or custom types');
  }

  return type;
} // determine if the schema declaration is an explicit declaration
// of the type. eg: (type: 2) is implicit number


function isExplicit(type, val) {
  if (type === 'string') {
    return val === 'string' || val === String;
  }

  if (type === 'number') {
    return val === 'number' || val === Number;
  }

  if (type === 'boolean') {
    return val === 'boolean' || val === Boolean;
  }

  if (type === 'array') {
    return val === 'array' || val === Array;
  }

  if (type === 'object') {
    return val === 'object' || val === Object;
  }

  return true;
}

function getTypeCfg(type) {
  return NATIVE_TYPES[type] || CUSTOM_TYPES[type];
}

/***/ }),

/***/ "./src/util/index.js":
/*!***************************!*\
  !*** ./src/util/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var util = {};

var identity = function identity(a) {
  return a;
}; // From js - https://github.com/tweenjs/tween.js/blob/master/src/Tween.js
// Include a performance.now polyfill.
// In node.js, use process.hrtime.


if (typeof window === 'undefined' && typeof process !== 'undefined') {
  util.now = function now() {
    var time = process.hrtime(); // Convert [seconds, nanoseconds] to milliseconds.

    return time[0] * 1000 + time[1] / 1000000;
  };
} else if (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined) {
  // In a browser, use window.performance.now if it is available.
  // This must be bound, because directly assigning this function
  // leads to an invocation exception in Chrome.
  util.now = window.performance.now.bind(window.performance);
} else if (Date.now !== undefined) {
  // Use Date.now if it is available.
  util.now = Date.now;
} else {
  // Otherwise, use 'new Date().getTime()'.
  util.now = function now() {
    return new Date().getTime();
  };
} // clamp


util.clamp = function (min, max, v) {
  return Math.min(Math.max(v, min), max);
};

util.mapProperties = function (obj, fn) {
  return Object.keys(obj).reduce(function (ret, val, key) {
    ret[key] = fn(val, key);
    return ret;
  }, {});
};

util.pick = function (obj) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!keys) {
    // all
    return _objectSpread({}, obj);
  }

  return keys.reduce(function (out, k) {
    out[k] = obj[k];
    return out;
  }, {});
}; // Only take properties that are present in
// first object
// ---------------------------------------


util.mergeIntersecting = function (first, second) {
  return _objectSpread({}, first, util.pick(second, Object.keys(first)));
};
/**
 * util.sortedIndex( array, value[, callback] ) -> Number
 * - array (Array): The array to inspect
 * - value (Mixed): The value to evaluate
 * - callback (Function): Function called per iteration
 *
 * Implementation of [lodash.sortedIndex](http://lodash.com/docs#sortedIndex).
 **/


util.sortedIndex = function (array, value, callback) {
  var low = 0;
  var high = array ? array.length : low; // explicitly reference `identity` for better inlining in Firefox

  callback = callback || identity;
  value = callback(value);

  while (low < high) {
    var mid = void 0;
    mid = low + high >>> 1;

    if (callback(array[mid]) < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
};

util.getIntersectingPaths = function (o1, o2) {
  return Object.keys(o1).filter(Object.prototype.hasOwnProperty.bind(o2));
};

var _default = util;
exports.default = _default;
module.exports = exports.default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/process/browser.js */ "./node_modules/process/browser.js")))

/***/ })

/******/ });
});
//# sourceMappingURL=frames.js.map