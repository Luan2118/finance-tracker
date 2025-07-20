import express from 'express';
import Income from '../models/income.js'
import validateId from '../middleware/validateID.js';
import {getAllIncome, createIncome, updateIncome, deleteIncome} from '../controllers/incomeController.js';

const router = express.Router();

// Get all incomes
router.get('/', getAllIncome)

// Create an income
router.post('/', createIncome)


// Update an expense
router.put('/', updateIncome)

// Delete an income
router.delete('/:id', validateId(Income), deleteIncome)


export default router;