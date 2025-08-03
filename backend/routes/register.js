import express from 'express';
import User from '../models/user.js'
import validateRegister from '../middleware/validateRegister.js';

const router = express.Router();

router.get('/users', async(req, res, next) => {
  try {
    const allUsers = await User.find();

    res.send(allUsers)
  } catch (error) {
    next(error)
  }
})

router.post('/', validateRegister(), async (req, res, next ) => {
  try {
    const {username, email, password} = req.body;
  
    const user = new User({
      username,
      email,
      password
    })
    
    const newUser = await user.save();
    res.status(201).json({msg: 'User succesfully registered'})
  } catch (error) {
    next(error)
  }
})



export default router;