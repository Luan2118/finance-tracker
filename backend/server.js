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
const allowedOrigins =  ['http://localhost:5500', 'https://finance-tracker-project-sigma.vercel.app']

const databaseURL = process.env.DATABASE_URL

// --- DB ---
mongoose.connect(databaseURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1)
  })

-

// CORS (restricting to your frontend origin)
server.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// security headers
server.use(helmet());

// Parsers
server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());

// Rate limits (global + stricter on auth)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  // don't count CORS preflights; disable in dev
  skip: (req) => req.method === 'OPTIONS' || process.env.NODE_ENV !== 'production',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 100 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {error: { message: 'Too many requests, please try again later.', code: 'RATE_LIMIT'  }}
})


// Middleware
server.use(logger)

// --- mount limiters BEFORE routers ---
server.use('/login', authLimiter);
server.use('/register', authLimiter);

// apply API limiter only to data routes
server.use('/expenses', apiLimiter);
server.use('/income', apiLimiter);

// Routes
server.use('/register', registerRouter)
server.use('/login', loginRouter)
server.use('/expenses', expensesRouter)
server.use('/income', incomeRouter)


// Error Handlers
server.use(notFound);
server.use(errorHandler);


// --- Start ---
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
