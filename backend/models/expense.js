import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
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

expenseSchema.virtual('dateOnly').get(function() {
  return this.dateValue.toISOString().substring(0, 10);
});


export default mongoose.model('Expense', expenseSchema);