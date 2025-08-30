import express from 'express';
import Expense from '../models/expense.js'
import errorHandler from '../middleware/errorHandler.js';
import validateId from '../middleware/validateID.js';
import validateInput from '../middleware/validateInput.js';
import { getAllExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Get all expenses
router.get('/', authenticateToken, getAllExpense)

// // Create an expense
router.post('/', validateInput('expenseSourceValue'), authenticateToken, createExpense)

// Update an expense
router.put('/',authenticateToken, updateExpense)

//  Delete an expense
router.delete('/:id', validateId(Expense), authenticateToken, deleteExpense)



export default router;