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
    const {category, expenseSourceValue, amountValue, currency, dateValue, emoji } = req.body;

    const expense = new Expense({
      category,
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

    const data = req.body

    for (const expense of data) {
      const {_id, ...updates} = expense

        await Expense.findOneAndUpdate(
        {_id, user: req.user.id},
        { $set: updates},
        { new: true}
      )
    }

    res.status(200).json({msg: 'Data updated'})
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