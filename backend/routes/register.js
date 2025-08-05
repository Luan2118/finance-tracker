import express from 'express';
import User from '../models/user.js'
import validateRegister from '../middleware/validateRegister.js';
import bcrypt from 'bcrypt';
const router = express.Router();



router.post('/', validateRegister(), async (req, res, next ) => {
  try {

    
    const {username, email, password} = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = new User({
      username,
      email,
      password: hashedPassword
    })
    

    const newUser = await user.save();
    res.status(201).json({msg: 'User succesfully registered'})
  } catch (error) {
    next(error)
  }
})



export default router;