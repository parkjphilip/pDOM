const $p = require("../lib/main.js");
const gameView = require("./gameView.js");

document.addEventListener('DOMContentLoaded', () => {
  $p('.new-game').removeClass('hidden');
  const rootEl = $p('.grid');
  const view = new gameView(rootEl);
  $p('.new-game').on('click', () => {
    view.gameInterval = setInterval( view.step.bind(view), 100);

    $p('.new-game').addClass('hidden');
  });
});
