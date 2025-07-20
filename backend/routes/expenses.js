import express from 'express';
import Expense from '../models/expense.js'
import errorHandler from '../middleware/errorHandler.js';
import validateId from '../middleware/validateID.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req , res) => {
   try {
    const expenses = await Expense.find()

    res.status(200).json(expenses)
  } catch (error) {
    next(error)
  }
})

// // Create an expense
router.post('/', async (req , res, next) => {
  try {
    const {expenseSourceValue, amountValue, currency, dateValue, emoji } = req.body;

    if (!expenseSourceValue || !amountValue || !currency || !dateValue || !emoji) {
      const error = new Error('Please fill all fields!')
      error.status = 400;
      return next(error)
    }

    const expense = new Expense({
      expenseSourceValue,
      amountValue,
      currency,
      dateValue,
      emoji
    })

    const newExpense = await expense.save();
    res.status(200).json({msg: newExpense})

  } catch (error) {
    next(error)
  }
})

// Update an expense
router.put('/', async (req, res) =>{
  try {
    await Expense.deleteMany({});
    const newExpenses = await Expense.insertMany(req.body)
    res.status(200).json(newExpenses)
  } catch (error) {
    next(error)
  }

})

// // Delete an expense
router.delete('/:id', validateId, async (req , res) => {
  
  try {
    await Expense.deleteOne({_id: req.params.id});
    res.status(200).json({msg: 'Expense Deleted'})
  } catch (error) {
    next(error)
  }
})



export default router;