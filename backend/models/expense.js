import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Food & Groceries",
      "Dining Out / Takeout",
      "Shopping",
      "Transportation",
      "Health",
      "Entertainment",
      "Travel",
      "Education",
      "Housing",
      "Other-Expense"
    ]
  },
  expenseSourceValue: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  amountValue: {
    type: Number,
    min: 1,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['CZK', 'EUR', 'USD', 'JPY', 'GBP']
  },
  dateValue: {
    type: String, 
    required: true
  },
  emoji: {
    type: String,
    default: ''
  }
})


export default mongoose.model('Expense', expenseSchema);