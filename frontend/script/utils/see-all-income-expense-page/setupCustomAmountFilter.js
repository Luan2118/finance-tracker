export let filterAmountValue;
export let customAmountClicked;

export function setupCustomAmountFilter() {

  // After selecting an amount range / expense range
  const MAX_VALUE = 100_000_000

  const filterAmountCustonBtn = document.querySelector('.filter-button-amount-custom-js')


  const minAmountId = document.getElementById('min-amount');
  const maxAmountId = document.getElementById('max-amount');

  filterAmountCustonBtn.addEventListener('click', () => {
    customAmountClicked = true;

    document.querySelector('.special2')?.classList.remove('special2');
    filterAmountCustonBtn.classList.add('special2');
    
    minAmountId.innerHTML = 'Min<input class="min-amount-js" type="number">';
    maxAmountId.innerHTML =  'Max<input class="max-amount-js" type="number">';
    
    if (minAmountId.style.display === 'block' || maxAmountId.style.display === 'block') {
      minAmountId.style.display = 'none';
      maxAmountId.style.display = 'none';
    } else {
      minAmountId.style.display = 'block';
      maxAmountId.style.display = 'block';
    }
  })
  
  
  
  const filterAmount = document.querySelectorAll('.filter-button-amount')
  filterAmount.forEach((buttonAmount) => {
    buttonAmount.addEventListener('click', () => {
      customAmountClicked = false
      minAmountId.style.display = 'none';
      maxAmountId.style.display = 'none';
      document.querySelector('.special2')?.classList.remove('special2')
      buttonAmount.classList.add('special2')
      filterAmountValue = Number(buttonAmount.value)

      filterAmountValue = Number.isNaN(filterAmountValue) || filterAmountValue === undefined ? MAX_VALUE : filterAmountValue
    })
  })

}

