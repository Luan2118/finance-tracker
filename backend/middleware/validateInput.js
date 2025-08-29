
function validateInput(sourceValueType) {

  return (req, res, next) => {

    
    const sourceType = sourceValueType === 'expenseSourceValue' ? 'Expense' : 'Income'

    const {category, amountValue, currency, dateValue, emoji } = req.body;

    const isOnlyLettersSource = /^[a-zA-Z -]+$/.test(req.body[sourceValueType]);

    const parsedAmount = Number(amountValue);

    const allowedExpenseCategories = [
      "Food & Groceries",
      "Dining Out / Takeout",
      "Shopping",
      "Transportation",
      "Health",
      "Entertainment",
      "Travel",
      "Education",
      "Housing",
      "Other-Expense",
      //  not included in create/update  "see-all"
    ]

    const allowedIncomeCategories = [
      "Salary",
      "Part-Time",
      "Overtime",
      "Interest",
      "Other-Income",
      // not included in create/update 
    ]


    const allowedCurrencies = ['CZK', 'EUR', 'JPY', 'USD', 'GBP']
    const normalizedCurrency = typeof currency === 'string' ? currency.toUpperCase() : '';
    const isOnlyLettersCurrency = /^[A-Z]{3}$/.test(normalizedCurrency);
    const parsedDate = new Date(dateValue)
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);

    
   if (sourceValueType === 'expenseSourceValue') {
    if(!allowedExpenseCategories.includes(category)) {
      const error = new Error('Invalid category')
      error.status = 422;
      return next(error)
    }
   }

   if (sourceValueType === 'incomeSourceValue') {
    if(!allowedIncomeCategories.includes(category)) {
      const error = new Error('Invalid category')
      error.status = 422;
      return next(error)
    }
   }
    
    if (req.body[sourceValueType] == null || req.body[sourceValueType] === '' ||
      amountValue == null || amountValue === '' ||
      currency == null || currency === '' ||
      dateValue == null || dateValue === '' ||
      category == null || category === '') {
      const error = new Error('Please fill all fields!')
      error.status = 422;
      return next(error)
    } 
    
    if(typeof req.body[sourceValueType] !== 'string' || !isOnlyLettersSource) {
      const error = new Error(`${sourceType}Source has to be a word`)
      error.status = 422;
      return next(error)
    }

 
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      const error = new Error(`${sourceType} amount has to be a number and greater than 0`)
      error.status = 422;
      return next(error)
    }

    if (typeof currency !== 'string' || !isOnlyLettersCurrency || !allowedCurrencies.includes(normalizedCurrency)) {
      const error = new Error('Invalid currency!')
      error.status = 422;
      return next(error)
    }


    if (typeof dateValue !== 'string' || !isValidDateFormat ||isNaN(parsedDate.getTime())) {
      const error = new Error('Invalid date!')
      error.status = 422;
      return next(error)
    }


    next()
  }
} 


export default validateInput;