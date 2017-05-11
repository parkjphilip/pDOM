const Board = require("./board.js");
const $p = require("../lib/main.js");

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
