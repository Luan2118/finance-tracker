import { API_BASE_URL } from "./utils/apiConfig.js";

function logOut() {

  const logoutBtn = document.querySelector('.logout-button-js')
  
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch(`${API_BASE_URL}/login/logout`, {
        method: 'POST',
        credentials: 'include'
      })
  
      sessionStorage.removeItem('accessToken');
  
      window.location.href = 'index.html'
    } catch (error) {
      console.error(error.message)
    }
  })
}

export default logOut;