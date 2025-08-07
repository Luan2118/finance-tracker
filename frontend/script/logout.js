
function logOut() {

  const logoutBtn = document.querySelector('.logout-button-js')
  
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('http://localhost:3000/login/logout', {
        method: 'POST',
        credentials: 'include'
      })
  
      sessionStorage.removeItem('accessToken');
  
      window.location.href = 'login.html'
    } catch (error) {
      console.error(error.message)
    }
  })
}

export default logOut;