


const loginButton = document.querySelector('.login-button-js');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;

const loginValidation = document.querySelector('.login-validation');


loginButton.addEventListener('click', async (e) => {

  e.preventDefault();

  const emailValue = document.querySelector('.login-input-js').value.trim();
  const password = document.querySelector('.password-input-js').value;

  if(emailValue === '' || password === '') {
    return loginValidation.textContent = 'Empty fields!'
  }
  
  
  if(!emailRegex.test(emailValue)) {
    return loginValidation.textContent = 'Not a valid email'
  }
  loginValidation.innerHTML = ''

  
  const userLogin = {
    email: emailValue,
    password
  }

  try {

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userLogin)
    })



    const result = await response.json();

    if(!response.ok) {
      return loginValidation.innerHTML = result.error;
    }

    if (result.accessToken) {
      sessionStorage.setItem('accessToken', result.accessToken);
      window.location.href = 'index.html'
    } 

  } catch (error) {
    console.error(error.message);
  }
})

