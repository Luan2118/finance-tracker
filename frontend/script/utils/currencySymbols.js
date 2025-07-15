
export function getSymbol(sharedData) {
  if(!sharedData || sharedData.length === 0 || sharedData[0].currency === '') {
    return '';
  }

  const currencySymbol =
  sharedData[0].currency === 'USD' ? '$' :
  sharedData[0].currency === 'EUR' ? '€' :
  sharedData[0].currency === 'JPY' ? '¥' :
  sharedData[0].currency === 'GBP' ? '£' :
  sharedData[0].currency === 'CZK' ? 'Kč' :
  '';

  return currencySymbol;
}



export function formatCurrency(amount, currencySymbol) {
  return `${currencySymbol !== 'Kč' ? currencySymbol : ''}${amount} ${currencySymbol === 'Kč' ? currencySymbol : ''}`
} 