/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(collection = []) {
    this.collection = collection;
  }

  html(arg) {
    if (arg === undefined) {
      return this.collection[0].innerHTML;
    } else {
      this.collection.forEach((node) => {
        node.innerHTML = arg;
        return;
      });
    }
  }

  empty() {
    return this.html('');
  }

  append(content) {
    if (typeof content === 'string') {
      this.collection.forEach((node) => {
        node.innerHTML += content;
      });
    } else if (content instanceof DOMNodeCollection) {
      this.collection.forEach((parent) => {
        content.collection.forEach((child) => {
          parent.appendChild(child.cloneNode(true));
        });
      });
    }
  }

  attr(key, val) {
    if (val === undefined) {
      return this.collection[0].getAttribute(key);
    } else {
      this.collection[0].setAttribute(key, val);
      return;
    }
  }

  addClass(className) {
    this.collection.forEach(node => node.classList.add(className));
  }

  removeClass(className) {
    this.collection.forEach(node => node.classList.remove(className));
  }

  children() {
    let childrenCollection = [];
    this.collection.forEach((childElement) => {
      childrenCollection = childrenCollection.concat(childElement.children);
    });

    return new DOMNodeCollection(childrenCollection);
  }

  parent() {
    let parentCollection = [];
    this.collection.forEach((childElement) => {
      parentCollection = parentCollection.concat(childElement.parentElement);
    });

    return new DOMNodeCollection(parentCollection);
  }

  find(selector) {
    let selectorNodes = [];
    this.collection.forEach((node) => {
      const allNodes = node.querySelectorAll(selector);
      selectorNodes = selectorNodes.concat(Array.from(allNodes));
    });
    return new DOMNodeCollection(selectorNodes);
  }

  remove() {
    this.collection.forEach(node => node.parentNode.removeChild(node));
  }

  on(e, callback) {
    this.collection.forEach((node) => {
      node.addEventListener(e, callback);
      node.eventCallBack = callback;
    });
    return;
  }

  off(e) {
    this.collection.forEach((node) => {
      const callback = node.eventCallBack;
        node.removeEventListener(e, callback);
    });
  }

}

module.exports = DOMNodeCollection;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(0);

const functionQueue = [];
let docReady = false;
document.addEventListener("DOMContentLoaded", execute);

function execute() {
  docReady = true;
  functionQueue.forEach((func) => {
    func();
  });
}

window.$p = function(selector) {
  if (typeof selector === "function") {
    if (docReady) {
      selector();
    } else {
      functionQueue.push(selector);
    }
  } else if (selector instanceof HTMLElement) {
      return new DOMNodeCollection([selector]);
  } else if (typeof selector === "string") {
      const nodeList = document.querySelectorAll(selector);
      const nodeListArray = Array.from(nodeList);
      return new DOMNodeCollection(nodeListArray);
  } else if (selector === window) {
      return new DOMNodeCollection([window]);
  }
};

$p.extend = function(objectA, ...objects) {
  objects.forEach((object) => {
    for (let key in object) {
      objectA[key] = object[key];
    }
  });
  return objectA;
};

$p.ajax = function(options = {}) {
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    data: {},
    success: function() {},
    error: function() {}
  };

  $p.extend(defaults, options);
  const request = new XMLHttpRequest();

  request.open(defaults.method, defaults.url);
  request.onload = function() {
    if (request.status === 200) {
      defaults.success(JSON.parse(request.response));
    } else {
      defaults.error(JSON.parse(request.response));
    }
  };
  request.send(defaults.data);
};


/***/ })
/******/ ]);