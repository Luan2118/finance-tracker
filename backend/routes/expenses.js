import express from 'express';
import Expense from '../models/expense.js'
import errorHandler from '../middleware/errorHandler.js';
import validateId from '../middleware/validateID.js';
import validateInput from '../middleware/validateInput.js';
import { getAllExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

// Get all expenses
router.get('/', getAllExpense)

// // Create an expense
router.post('/', validateInput('expenseSourceValue'), createExpense)

// Update an expense
router.put('/', updateExpense)

//  Delete an expense
router.delete('/:id', validateId(Expense), deleteExpense)



export default router;