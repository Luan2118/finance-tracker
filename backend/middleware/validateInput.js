
function validateInput(sourceValueType) {

  return (req, res, next) => {
    
    const sourceType = sourceValueType === 'expenseSourceValue' ? 'Expense' : 'Income'

    const {amountValue, currency, dateValue, emoji } = req.body;

    const isOnlyLettersSource = /^[a-zA-Z ]+$/.test(req.body[sourceValueType]);

    const parsedAmount = Number(amountValue);

    const allowedCurrencies = ['CZK', 'EUR', 'JPY', 'USD', 'GBP']
    const normalizedCurrency = currency.toUpperCase();  
    const isOnlyLettersCurrency = /^[A-Z]{3}$/.test(normalizedCurrency);
    const parsedDate = new Date(dateValue)
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

    
    if (!req.body[sourceValueType] || !amountValue || !currency || !dateValue) {
      const error = new Error('Please fill all fields!')
      error.status = 400;
      return next(error)
    } 
    
    if(typeof req.body[sourceValueType] !== 'string' || !isOnlyLettersSource) {
      const error = new Error(`${sourceType}Source has to be a word`)
      error.status = 400;
      return next(error)
    }

 
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      const error = new Error(`${sourceType} amount has to be a number and greater than 0`)
      error.status = 400;
      return next(error)
    }

    if (typeof currency !== 'string' || !isOnlyLettersCurrency || !allowedCurrencies.includes(normalizedCurrency)) {
      const error = new Error('Invalid currency!')
      error.status = 400;
      return next(error)
    }


    if (typeof dateValue !== 'string' || !isValidDateFormat ||isNaN(parsedDate.getTime())) {
      const error = new Error('Invalid date!')
      error.status = 400;
      return next(error)
    }


    // if(typeof emoji !== 'string' || /^[a-zA-Z0-9]*$/.test(emoji)) {
    //   const error = new Error('Invalid emoji input!')
    //   error.status = 400;
    //   return next(error)
    // }
    next()
  }
} 


export default validateInput;