
document.addEventListener("DOMContentLoaded", () => {
  $p('.submit-button').on('click', () => {
    let input = $p('.input-body').collection[0].value;

    if (input.length > 0) {
      $p('ul').append(`<li class="item ">${input} <button class="remove-button">Remove Item</button> </li>`);
      $p('input').collection[0].value = "";

      $p(`.remove-button`).on('click', (e) => {
        $p(e.currentTarget).parent().remove();
      });
    } else {
      alert ('Todo Item must have text.');
    }
  });

  $p('.clear-button').on('click', () => {
    $p('ul').empty();
  });
});
