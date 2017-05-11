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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(2);

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

module.exports = $p;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(3);
const $p = __webpack_require__(0);

class gameView{
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.board = new Board();
    this.grid = this.buildGrid();
    $p(window).on("keydown", this.handleKeyEvent.bind(this));
    this.gameInterval = window.setInterval( this.step.bind(this), 100);
  }

  buildGrid() {
    let rootInnerHTML = "";
    for (let i = 0; i < this.board.dimension; i++) {
      rootInnerHTML += "<ul>";
      for (let j = 0; j < this.board.dimension; j++) {
        rootInnerHTML += "<li></li>";
      }
      rootInnerHTML += "</ul>";
    }
    this.rootEl.html(rootInnerHTML);
    this.liList = $p("li");
  }

  handleKeyEvent(e) {
    if (gameView.KEYS[e.keyCode]) {
      this.board.snake.turn(gameView.KEYS[e.keyCode]);
    }
  }

  render() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
    this.updateScore();
  }

  updateClasses(coords, className) {
    $p(`.${className}`).removeClass(className);
    coords.forEach( coord => {
      const flatCoord = (coord.x * this.board.dimension) + coord.y;
      if (this.liList) {
        this.liList.eq(flatCoord).addClass(className);
      }
    });
  }

  updateScore() {
    this.scoreEl = $p('.score');

    this.scoreEl.html(`Score: ${this.board.score}`);
  }
  step() {
    if (this.board.snake.segments.length > 0 ) {
      this.board.snake.move();
      this.render();
    } else {
      alert('you lose');
      window.clearInterval(this.gameInterval);
    }
  }
}

gameView.KEYS = {
  37: "W",
  38: "N",
  39: "E",
  40: "S",
};

module.exports = gameView;


/***/ }),
/* 2 */
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

  eq(idx) {
    return new DOMNodeCollection([this.collection[idx]]);
  }
}

module.exports = DOMNodeCollection;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Snake = __webpack_require__(6);
const Coord = __webpack_require__(4);
const Apple = __webpack_require__(7);

class Board {
  constructor() {
    this.snake = new Snake(this);
    this.score = 0;
    this.dimension = 25;
    this.apple = new Apple(this);
  }

  isValidPosition(coord) {
    return (coord.x >= 0 && coord.x < this.dimension &&
            coord.y >= 0 && coord.y < this.dimension);
  }
}

module.exports = Board;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(coord2) {
    return (this.x == coord2.x) && (this.y == coord2.y);
  }

  isOpposite(coord2) {
    return (this.x == (-1 * coord2.x)) && (this.y == (-1 * coord2.y));
  }

  plus(coord2) {
    return new Coord(this.x + coord2.x, this.y + coord2.y);
  }
}

module.exports = Coord;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const $p = __webpack_require__(0);
const gameView = __webpack_require__(1);

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = $p('.grid');
  const view = new gameView(rootEl);
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(4);

class Snake {
  constructor(board) {
    this.board = board;
    this.isTurning = false;
    this.direction = "E";
    this.segments = [new Coord(3, 3)];
    this.eatApple = this.eatApple.bind(this);
    this.growthLeft = 0;
  }

  head() {
    return this.segments.slice(-1)[0];
  }

  isValid() {
    const head = this.head();

    if (!this.board.isValidPosition(this.head())) {
      return false;
    }

    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }
    return true;
  }

  move() {
    // move snake forward

    this.segments.push(this.head().plus(Snake.MOVES[this.direction]));

    // allow turning again
    this.isTurning = false;

    // maybe eat an apple
    if (this.eatApple()) {
      this.board.score += 10;
      this.growthLeft = 3;
      this.board.apple.placeApple();
    }
    // if not growing, remove tail segment
    if (this.growthLeft > 0) {
      this.growthLeft -= 1;
    } else {
      this.segments.shift();
    }
    if (!this.isValid()) {
      this.segments = [];
    }
    // destroy snake if it eats itself or runs off grid
    // if (!this.isValid()) {
    //   this.segments = [];
    // }
  }

  turn(direction) {
    // avoid turning directly back on yourself
    if (Snake.MOVES[this.direction].isOpposite(Snake.MOVES[direction]) ||
      this.isTurning) {
      return;
    } else {
      this.isTurning = true;
      this.direction = direction;
    }
  }

  hasCoord(coords) {
    let result = false;
    this.segments.forEach( segment => {
     if ((segment.x === coords[0]) && (segment.y === coords[1])) {
       result = true;
     }
   });
   return result;
 }

  eatApple() {
    if (this.head().equals(this.board.apple.position)) {
      return true;
    } else {
      return false;
    }
  }

}

Snake.MOVES = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};


module.exports = Snake;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(4);

class Apple {
  constructor(board) {
    this.board = board;
    this.placeApple();
  }

  placeApple() {
    let x = Math.floor(Math.random() * this.board.dimension);
    let y = Math.floor(Math.random() * this.board.dimension);
    // debugger
    while (this.board.snake.hasCoord([x, y])) {
      x = Math.floor(Math.random() * this.board.dimension);
      y = Math.floor(Math.random() * this.board.dimension);
    }
    this.position = new Coord(x, y);
  }
}

module.exports = Apple;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map