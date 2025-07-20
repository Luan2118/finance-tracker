import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  incomeSourceValue: {
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


export default mongoose.model('Income', incomeSchema);