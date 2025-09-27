
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



export  function formatCurrency(amount, currencySymbol) {
  if (currencySymbol === 'Kč') {
    return `${amount} Kč`;
  } else {
    return `${currencySymbol}${amount}`
  }
} 


export async function loadGetSymbol(symbolData) {  
  const resolvedData = await symbolData;
  return getSymbol(resolvedData);
}

