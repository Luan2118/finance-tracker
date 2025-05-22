const dialog = document.getElementById('add-expense-dialog')


document.querySelector('.js-add-expense-button')
  .addEventListener('click', () => {
    dialog.showModal();
  })

document.querySelector('.js-add-expense-popup-close')
  .addEventListener('click', () => {
    dialog.close();
  })


