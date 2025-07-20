import express from 'express';
import Income from '../models/income.js'
import validateId from '../middleware/validateID.js';

const router = express.Router();

// Get all incomes
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    next(error)
  }
})

// Create an income
router.post('/', async (req, res) => {
  try {
    const {incomeSourceValue, amountValue, currency, dateValue, emoji} = req.body

    if (!expenseSourceValue || !amountValue || !currency || !dateValue || !emoji) {
      const error = new Error('Please fill all fields!')
      error.status = 400;
      return next(error)
    }

    const income = new Income({
      incomeSourceValue,
      amountValue,
      currency,
      dateValue,
      emoji
    })

    const newIncome = await income.save();
    res.status(201).json({income})
  } catch (error) {
     next(error)
  }
})


// Update an expense
router.put('/',  async (req, res) =>{
  try {
    await Income.deleteMany({})
    const newIncome = await Income.insertMany(req.body)

    res.status(200).json(newIncome)

  } catch (error) {
    next(error)
  }
})

// Delete an income
router.delete('/:id', validateId, async (req, res, next) => {

  try {
    await Income.deleteOne({_id: req.params.id});
    res.status(200).json({msg: 'Income Deleted'})
  } catch (error) {
    next(error)
  }

})


export default router;