import User from '../models/user.js'

function validateRegister() {

  return async (req, res, next) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    const { username, email, password } = req.body;



    if (!username || !email || !password) {
      const error = new Error('Username, email and password are required');
      error.status = 400;
      return next(error);
    }


    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      const error = new Error('Username, email, and password must be strings');
      error.status = 400;
      return next(error);
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername.length < 3) {
      const error = new Error('Username has to have at least 3 characters')
      error.status = 422;
      return next(error);
    }

    if (!emailRegex.test(trimmedEmail)) {
      const error = new Error('Invalid email')
      error.status = 422;
      return next(error);
    }

    if (!passwordRegex.test(trimmedPassword)) {
      const error = new Error('Password has to contain 1 uppercase letter, 1 number, at least 6 characters')
      error.status = 422;
      return next(error);
    }

    const newUserName = await User.findOne(({ username: trimmedUsername }))

    if (newUserName) {
      const error = new Error('User with this name already exists')
      error.status = 422;
      return next(error);
    }

    const newUserEmail = await User.findOne(({ email: trimmedEmail }))

    if (newUserEmail) {
      const error = new Error('User with this email already exists')
      error.status = 422;
      return next(error);
    }

    req.body.username = trimmedUsername;
    req.body.email = trimmedEmail;
    req.body.password = trimmedPassword;

    next();
  }
}


export default validateRegister;