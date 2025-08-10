import express from 'express';
import Income from '../models/income.js'
import validateId from '../middleware/validateID.js';
import {getAllIncome, createIncome, updateIncome, deleteIncome} from '../controllers/incomeController.js';
import validateInput from '../middleware/validateInput.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Get all incomes
router.get('/', authenticateToken, getAllIncome)

// Create an income
router.post('/', validateInput('incomeSourceValue'), authenticateToken, createIncome)


// Update an expense
router.put('/', updateIncome)

// Delete an income
router.delete('/:id', validateId(Income), deleteIncome)


export default router;