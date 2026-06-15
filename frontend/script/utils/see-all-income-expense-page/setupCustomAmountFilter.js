export let filterAmountValue;
export let customAmountClicked;
export let amountBtnsClicked;

export function setUpCustomAmountFilter() {

  // After selecting an amount range / expense range
  const MAX_VALUE = 100_000_000

  const filterAmountCustomBtn = document.querySelector('.filter-button-amount-custom-js')


  const minAmountId = document.getElementById('min-amount');
  const maxAmountId = document.getElementById('max-amount');

  filterAmountCustomBtn.addEventListener('click', () => {
    customAmountClicked = true;
    amountBtnsClicked =  false;
    filterAmountCustomBtn.setAttribute('aria-expanded', 'true');
    document.querySelector('.special2')?.classList.remove('special2');
    filterAmountCustomBtn.classList.add('special2');
    
    minAmountId.innerHTML = '<label>Min <input class="min-amount-input min-amount-js" type="number"></label>';
    maxAmountId.innerHTML =  '<label>Max <input class="max-amount-input max-amount-js" type="number"></label>';
    
    if (minAmountId.style.display === 'block' || maxAmountId.style.display === 'block') {
      customAmountClicked = false
      minAmountId.style.display = 'none';
      maxAmountId.style.display = 'none';
      filterAmountCustomBtn.setAttribute('aria-expanded', 'false');
      document.querySelector('.special2')?.classList.remove('special2')
    } else {
      amountBtnsClicked = false;
      customAmountClicked = true;
      minAmountId.style.display = 'block';
      maxAmountId.style.display = 'block';
    }
  })
  
  
  
  const filterAmount = document.querySelectorAll('.filter-button-amount')
  filterAmount.forEach((buttonAmount) => {
    buttonAmount.addEventListener('click', () => {
      amountBtnsClicked = true;
      customAmountClicked = false
      minAmountId.style.display = 'none';
      maxAmountId.style.display = 'none';
      filterAmountCustomBtn.setAttribute('aria-expanded', 'false');
      document.querySelector('.special2')?.classList.remove('special2')
      buttonAmount.classList.add('special2')
      filterAmountValue = Number(buttonAmount.value)

      filterAmountValue = Number.isNaN(filterAmountValue) || filterAmountValue === undefined ? MAX_VALUE : filterAmountValue
    })
  })

}

