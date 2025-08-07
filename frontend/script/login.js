

const loginButton = document.querySelector('.login-button-js');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;



loginButton.addEventListener('click', async () => {
  const email = document.querySelector('.login-input-js').value.trim();
  const password = document.querySelector('.password-input-js').value;


  if(!emailRegex.test(email)) {
    return document.querySelector('.email-input-validation').innerHTML = '<div>Not a valid email</div>'
  }
  document.querySelector('.email-input-validation').innerHTML = ''
  
  const userLogin = {
    email,
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
      return document.querySelector('.login-validation').innerHTML = result.error;
    }

    if (result.accessToken) {
      sessionStorage.setItem('accessToken', result.accessToken);
      window.location.href = 'index.html'
    } 

  } catch (error) {
    console.error(error.message);
  }
})

