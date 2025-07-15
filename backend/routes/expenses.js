import express from 'express';
import Expense from '../models/expense.js'

const router = express.Router();

// Get all expenses
router.get('/', async (req , res) => {
   try {
    const expenses = await Expense.find()

    res.status(200).json(expenses)
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
})

// // Create an expense
router.post('/', async (req , res) => {
  const expense = new Expense({
    expenseSourceValue: req.body.expenseSourceValue,
    amountValue : req.body.amountValue,
    currency: req.body.currency,
    dateValue: req.body.dateValue,
    emoji: req.body.emoji
  })
  try {
    const newExpense = await expense.save();
    res.status(200).json(newExpense)
  } catch (error) {
    res.status(400).json({msg: error.message})
  }
})

// // Delete an expense
router.delete('/:id', async (req , res) => {
  const id = req.params.id
  const expense = await Expense.findById(id);

  if(!expense) {
    res.status(404).json({msg: 'Expense not found'})
  }

  try {
    const deletedExpense = await Expense.deleteOne(expense);
    res.status(200).json({msg: 'Expense Deleted'})
  } catch (error) {
    res.status(500).json({msg: error.message})
  }
})



export default router;