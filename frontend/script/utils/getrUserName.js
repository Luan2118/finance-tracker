import getAccessToken from "./getToken.js";

async function getUsername() {
  try {
    let token = await getAccessToken();

    const response = await fetch('http://localhost:3000/login/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if(response.status === 401) {
      token = await refreshToken();
      sessionStorage.setItem('accessToken', token)
      const response = await fetch('http://localhost:3000/login/user', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    }

    const result = await response.json();
    

    return result.username;
  } catch (error) {
    console.error(error.message)
  }
  

}

export default getUsername;