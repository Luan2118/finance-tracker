import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import expensesRouter from './routes/expenses.js'
import incomeRouter from './routes/income.js'
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import logger from './middleware/logger.js';
import registerRouter from './routes/register.js'
import loginRouter from './routes/login.js'
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;
const server = express();

mongoose.connect(process.env.DATABASE_URL)

// Enable CORS for all origins (you can restrict it later)
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true            
}));

server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.use(cookieParser());

server.use(logger)


server.use('/register', registerRouter)
server.use('/login', loginRouter)
server.use('/expenses', expensesRouter)
server.use('/income', incomeRouter)


// Error Handlers

server.use(notFound);
server.use(errorHandler);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
