import express from 'express';
import User from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/user', authenticateToken, async(req, res, next) => {
  try {
    const user = await User.findOne({_id: req.user.id});

    res.send(user)
  } catch (error) {
    next(error)
  }
})


router.post('/', async (req, res, next) => {  

  try {
    const {email, password} = req.body;
    
    const user = await User.findOne({email: email})

    if(!user) {
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
      expiresIn: '15s'
    })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
     accessToken
    })

  } catch (error) {
    next(error)
  }
})

router.post('/refresh', (req , res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) {
    const error = new Error('Token not found');
    error.status = 401;
    return next(error);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const error = new Error('Token veritification failed');
      error.status = 403;
      return next(error);
    }

    const payload2 = {
      id: payload.id,
      username: payload.username
    }

    const accessToken = jwt.sign(payload2, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    })

    res.status(200).json({accessToken})
  })
})

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  })
  res.status(200).json({msg: 'Logged out'})
})

export function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  

  if (!token) {
    const error = new Error('Token not found')
    error.status = 401;
    return next(error)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if(err) {
      const error = new Error('Token veritification failed')
      error.status = 401;
      return next(error)
    }

    req.user = payload;
    next()
  })
}


export default router;