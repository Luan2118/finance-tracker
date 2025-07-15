import express from 'express';
import mongoose from 'mongoose';
import expensesRouter from './routes/expenses.js'
import incomeRouter from './routes/income.js'
import cors from 'cors';

const PORT = process.env.PORT;
const server = express();

mongoose.connect(process.env.DATABASE_URL)

// Enable CORS for all origins (you can restrict it later)
server.use(cors());

server.use(express.json());

server.use('/expenses', expensesRouter)
server.use('/income', incomeRouter)


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
