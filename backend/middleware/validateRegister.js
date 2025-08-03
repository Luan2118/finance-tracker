function validateRegister() {
  
  return (req, res, next ) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

    const {username, email, password} = req.body;

    if (username.length < 3) {
      const error = new Error('Username has to have at least 3 characters')
      error.status = 400;
      return next(error);
    }

    if(!emailRegex.test(email)) {
      const error = new Error('Invalid email')
      error.status = 400;
      return next(error);
    }

    if(!passwordRegex.test(password)) {
       const error = new Error('Password has to contain 1 uppercase letter, 1 number, at least 6 characters')
      error.status = 400;
      return next(error);
    }

    next();
  }
}


export default validateRegister;