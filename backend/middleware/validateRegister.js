import User from '../models/user.js'

function validateRegister() {
  
  return async (req, res, next ) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

    const {username, email, password} = req.body;


    if (username.length < 3) {
      const error = new Error('Username has to have at least 3 characters')
      error.status = 422;
      return next(error);
    }

    if(!emailRegex.test(email)) {
      const error = new Error('Invalid email')
      error.status = 422;
      return next(error);
    }

    if(!passwordRegex.test(password)) {
      const error = new Error('Password has to contain 1 uppercase letter, 1 number, at least 6 characters')
      error.status = 422;
      return next(error);
    }

    const user = {
      username,
      email,
      password
    }

    const newUserName = await User.findOne(({username: username}))

    if(newUserName) {
      const error = new Error('User with this name already exists')
      error.status = 422;
      return next(error);
    }

    const newUserEmail = await User.findOne(({email: email}))

    if(newUserEmail) {
      const error = new Error('User with this email already exists')
      error.status = 422;
      return next(error);
    }
    next();
  }
}


export default validateRegister;