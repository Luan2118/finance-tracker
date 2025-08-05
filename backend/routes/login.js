import express from 'express';
import User from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.get('/user', authenticateToken, async(req, res, next) => {
  try {
    const user = await User.findOne({username: req.user.username});

    res.send(user)
  } catch (error) {
    next(error)
  }
})


router.post('/', async (req, res, next) => {  
  try {
    const {email, password} = req.body;
    
    const user = await User.findOne({email: email})

    if(user.length === 0) {
      const error = new Error('User not found')
      error.status = 404;
      return next(error)
    }



    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      const error = new Error('Invalid password')
      error.status = 404;
      return next(error)
    }

    const payload = {
      id: user._id,
      username: user.username
    }

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
})


// router.get('/refresh', (req, res) => {

// })

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = new Error('Invalid token')
    error.status = 400;
    return next(error)
  }

  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if(err) {
      const error = new Error('Token veritification failed')
      error.status = 400;
      return next(error)
    }

    req.user = payload;
    next()
  })
}


export default router;