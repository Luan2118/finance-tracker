import getAccessToken from "./getAccessToken.js";
import refreshToken from "./refreshToken.js";


 async function getUsername() {
  try {

    let token = await getAccessToken();

    let response = await fetch('http://localhost:3000/login/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if(response.status === 401) {
      token = await refreshToken();
      sessionStorage.setItem('accessToken', token)
       response = await fetch('http://localhost:3000/login/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    }
    
    if(!response.ok) throw new Error('failed to get username')
    const result = await response.json();
    return result.username;
  
  } catch (error) {
    console.error(error.message)
    throw error;
  }
}

export default getUsername;