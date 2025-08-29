import express from 'express';
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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'

const PORT = process.env.PORT || 3000;
const server = express();
const corsOrigin =  process.env.CORS_ORIGIN;
const databaseURL = process.env.DATABASE_URL

// --- DB ---
mongoose.connect(databaseURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1)
  })

// In prod behind a proxy (Render/Heroku/etc.), let rate-limit see real client IP
server.set('trust proxy', 1);

// CORS (restricting to your frontend origin)
server.use(cors({
  origin: corsOrigin,
  credentials: true            
}));

// security headers
server.use(helmet());

// Parsers
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());

// Rate limits (global + stricter on auth)
server.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window,
  standardHeaders: true,
  legacyHeaders: false
}))

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {error: { message: 'Too many requests, please try again later.', code: 'RATE_LIMIT'  }}
})


// Middleware
server.use(logger)


// Routes
server.use('/register', registerRouter, authLimiter)
server.use('/login', loginRouter, authLimiter)
server.use('/expenses', expensesRouter)
server.use('/income', incomeRouter)


// Error Handlers
server.use(notFound);
server.use(errorHandler);


// --- Start ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
