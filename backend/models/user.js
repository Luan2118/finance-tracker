import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 10,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match:  [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],

  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    match: [
    /^(?=.*[A-Z])(?=.*\d).+$/,
    'Password must contain at least one uppercase letter and one number',
  ]
  }
})

export default mongoose.model('User', userSchema)