import { API_BASE_URL } from "./utils/apiConfig";

const usernameValidation = document.querySelector('.username-input-validation');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
const emailValidation = document.querySelector('.email-input-validation');

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
const passwordValidation = document.querySelector('.password-input-validation')

const confirmPasswordValidation = document.querySelector('.confirm-password-input-validation')

const dialog = document.querySelector('.dialog')

const registerBtn = document.querySelector('.register-button-js');





registerBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const usernameInput = document.querySelector('.username-input-js');
  const emailInput = document.querySelector('.email-input-js');
  const passwordInput = document.querySelector('.password-input-js');
  const confirmPasswordInput = document.querySelector('.confirm-password-input-js');

  const username = usernameInput.value
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const confirmPassword = confirmPasswordInput.value

  if(username.length < 3) {
    usernameInput.setAttribute('aria-invalid', 'true')
    usernameValidation.setAttribute('role', 'alert')
    return usernameValidation.textContent = 'Username has to have at least 3 character'
  }
  usernameValidation.innerHTML = '';
  usernameInput.removeAttribute('aria-invalid')
  usernameValidation.removeAttribute('role')

  if (!emailRegex.test(email)) {
    emailInput.setAttribute('aria-invalid', 'true')
    emailValidation.setAttribute('role', 'alert')
    return emailValidation.textContent = 'Invalid e-mail'
  }

  emailValidation.innerHTML = '';
  emailInput.removeAttribute('aria-invalid')
  emailValidation.removeAttribute('role')


  if(!passwordRegex.test(password)) {
    passwordInput.setAttribute('aria-invalid', 'true')
    passwordValidation.setAttribute('role', 'alert')
    return passwordValidation.innerHTML = 
    `<span style="line-height: 1.2; color: red;">
    Password must contain:<br>
    • At least 1 uppercase letter<br>
    • At least 1 number<br>
    • Minimum length of 6 characters
    </span>`
  }

  passwordValidation.innerHTML = '';
  passwordInput.removeAttribute('aria-invalid')
  passwordValidation.removeAttribute('role')
  
  if (confirmPassword !== password) {
    confirmPasswordInput.setAttribute('aria-invalid', 'true')
    confirmPasswordValidation.setAttribute('role', 'alert')
    return confirmPasswordValidation.innerHTML = `<div>Password doesn't match </div>`
  }

  if(confirmPassword === password) {
    confirmPasswordInput.removeAttribute('aria-invalid')
    confirmPasswordValidation.removeAttribute('role')
    confirmPasswordValidation.innerHTML = ''
  }

  const newUser = {
    username,
    email,
    password
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
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
