import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  

  if (!token) {
    const error = new Error('Token not found')
    error.status = 401;
    return next(error)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if(err) {
      const error = new Error('Token verification failed')
      error.status = 401;
      return next(error)
    }

    req.user = payload;
    next()
  })
}

export default authenticateToken;