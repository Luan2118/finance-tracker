import express from 'express';
import Income from '../models/income.js'

const router = express.Router();

// Get all incomes
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
})

// Create an income
router.post('/', async (req, res) => {
  const income = new Income({
    incomeSourceValue: req.body.incomeSourceValue,
    amountValue: req.body.amountValue,
    currency: req.body.currency,
    dateValue: req.body.dateValue,
    emoji: req.body.emoji
  })
  try {

    const newIncome = await income.save();
    res.status(201).json({income})
  } catch (error) {
     res.status(500).json({msg: error.message});
  }
})


// Update an expense
router.put('/', async (req, res) =>{
  try {
    await Income.deleteMany({})
    const newIncome = await Income.insertMany(req.body)

    res.status(200).json(newIncome)

  } catch (error) {
    res.status(500).json({msg: error.message})
  }
})

// Delete an income
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const income = await Income.findById(id)

  if(!income) {
    res.status(404).json({msg: 'Income not found'})
  }

  try {
    const deletedIncome = await Income.deleteOne(income);
    res.status(200).json({msg: 'Income Deleted'})
  } catch (error) {
    res.status(500).json({msg: error.message})
  }

})


export default router;