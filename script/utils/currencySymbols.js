

export function getSymbol(data) {

  if(!data || data.length === 0 || data[0].currency === '') {
    return '';
  }

  const currencySymbol =
  data[0].currency === 'USD' ? '$' :
  data[0].currency === 'EUR' ? '€' :
  data[0].currency === 'JPY' ? '¥' :
  data[0].currency === 'GBP' ? '£' :
  data[0].currency === 'CZK' ? 'Kč' :
  '';

  return currencySymbol;
}
 