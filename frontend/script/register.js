const usernameValidation = document.querySelector('.username-input-validation');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
const emailValidation = document.querySelector('.email-input-validation');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
const passwordValidation = document.querySelector('.password-input-validation')

const confirmPasswordValidation = document.querySelector('.confirm-password-input-validation')

const dialog = document.querySelector('.dialog')

const registerBtn = document.querySelector('.register-button-js');




registerBtn.addEventListener('click', async () => {
  
  const username = document.querySelector('.username-input-js').value
  const email = document.querySelector('.email-input-js').value.trim()
  const password = document.querySelector('.password-input-js').value.trim()
  const confirmPassword = document.querySelector('.confirm-password-input-js').value

  if(username.length < 3) {
    return usernameValidation.innerHTML = '<div>Username has to have at least 3 character</div>'
  }
  usernameValidation.innerHTML = '';

  if (!emailRegex.test(email)) {
    return emailValidation.innerHTML = '<div>Invalid e-mail</div>'
  }

  emailValidation.innerHTML = '';

  if(!passwordRegex.test(password)) {
    return passwordValidation.innerHTML = 
    `<span style="line-height: 1.2; color: red;">
    Password must contain:<br>
    • At least 1 uppercase letter<br>
    • At least 1 number<br>
    • Minimum length of 6 characters
    </span>`
  }

  passwordValidation.innerHTML = '';
  
  if (confirmPassword !== password) {
    return confirmPasswordValidation.innerHTML = `<div>Password doesn't match </div>`
  }

  if(confirmPassword === password) {
    confirmPasswordValidation.innerHTML = ''
  }

  const newUser = {
    username,
    email,
    password
  }

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })

    const result = await response.json();

 
    if (!response.ok) {
      if(result.error === 'User with this name already exists') return usernameValidation.innerHTML = result.error;
      if(result.error === 'User with this email already exists') return emailValidation.innerHTML = result.error
      return document.querySelector('.register-error-js').innerHTML = result.error;
    }

      console.log('User registered')
      dialog.showModal();
    
      setTimeout(() => {
        window.location.href= 'login.html'
      },2000)
      
  } catch (error) {
    console.error(error.message);
  }
  



})
