import express from 'express';
import User from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();



router.post('/', async (req, res, next) => {  
  try {
    const {email, password} = req.body;
    
    const user = await User.find({email: email})

    if(user.length === 0) {
      const error = new Error('User not found')
      error.status = 404;
      return next(error)
    }



    const isMatch = await bcrypt.compare(password, user[0].password);

    if(!isMatch) {
      const error = new Error('Invalid password')
      error.status = 404;
      return next(error)
    }

    const payload = {
      id: user[0]._id,
      username: user[0].username
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)

    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
})





export default router;