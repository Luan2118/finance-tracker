import Expense from '../models/expense.js'

export const getAllExpense = async (req , res, next) => {
   try {
    const expenses = await Expense.find({user: req.user.id})

    res.status(200).json(expenses)
  } catch (error) {
    next(error)
  }
}

export const createExpense = async (req , res, next) => {
  try {
    const {expenseSourceValue, amountValue, currency, dateValue, emoji } = req.body;

    const expense = new Expense({
      expenseSourceValue,
      amountValue,
      currency,
      dateValue,
      emoji,
      user: req.user.id
    })

    const newExpense = await expense.save();
    res.status(200).json({msg: newExpense})

  } catch (error) {
    next(error)
  }
}

export const updateExpense = async (req, res, next) =>{
  try {
    await Expense.deleteMany({});
    const newExpenses = await Expense.insertMany(req.body)
    res.status(200).json(newExpenses)
  } catch (error) {
    next(error)
  }

}


export const deleteExpense = async (req , res, next) => {
  try {
    await Expense.deleteOne({_id: req.params.id});
    res.status(200).json({msg: 'Expense Deleted'})
  } catch (error) {
    next(error)
  }
}