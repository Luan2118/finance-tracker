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

  if (!emailRegex.test(email)) {
    return emailValidation.innerHTML = '<div>Invalid e-mail</div>'
  }

  if(!passwordRegex.test(password)) {
    return passwordValidation.innerHTML = 
    `<span style="line-height: 1.2; color: red;">
    Password must contain:<br>
    • At least 1 uppercase letter<br>
    • At least 1 number<br>
    • Minimum length of 6 characters
    </span>`
  }

  if (confirmPassword !== password) {
    return confirmPasswordValidation.innerHTML = `<div>Password doesn't match </div>`
  }

  if(confirmPassword === password) {
    confirmPasswordValidation.innerHTML = ''
  }

  const userData = {
    username,
    email,
    password
  }

  

  console.log('User registered')
  dialog.showModal();

  setTimeout(() => {
    window.location.href= 'login.html'
  },2000)


})

