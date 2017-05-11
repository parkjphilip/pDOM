const $p = require("../lib/main.js");
const gameView = require("./gameView.js");

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = $p('.grid');
  const view = new gameView(rootEl);
});
