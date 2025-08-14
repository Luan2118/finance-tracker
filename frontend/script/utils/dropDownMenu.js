export function dropDownMenu() {
  const dropDownIconBtn = document.getElementById('drop-down-icon')
  
  const iconSrc = document.querySelector('#drop-down-box img')
  const dropDownIcon = 'icons/dropdown-arrow-icon.png';
  const dropUpIcon = 'icons/dropup-arrow-icon.png';
  
  const currencyOptions = document.getElementById('options')
  
  dropDownIconBtn.addEventListener('click', () => {
    if (iconSrc.src.includes(dropDownIcon)) {
      iconSrc.src = dropUpIcon;
      currencyOptions.style.display = 'block';
    }else {
      iconSrc.src = dropDownIcon;
      currencyOptions.style.display = 'none';
    }
  })
}