import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import expensesRouter from './routes/expenses.js'
import incomeRouter from './routes/income.js'
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import logger from './middleware/logger.js';
import registerRouter from './routes/register.js'

const PORT = process.env.PORT;
const server = express();

mongoose.connect(process.env.DATABASE_URL)

// Enable CORS for all origins (you can restrict it later)
server.use(cors());

server.use(express.json());
server.use(express.urlencoded({extended: false}));

// logger middleware
server.use(logger)

server.use('/expenses', expensesRouter)
server.use('/income', incomeRouter)
server.use('/register', registerRouter)


// Error Handlers

server.use(notFound);
server.use(errorHandler);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
