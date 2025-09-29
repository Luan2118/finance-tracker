async function refreshToken() {

  try {
    const response = await fetch('http://localhost:3000/login/refresh', {
      method: 'POST',
      credentials: 'include'
    })
  
    
    if(!response.ok) throw new Error('failed to fetch refresh token')
    let result = await response.json();

    return result.accessToken;

  } catch (error) {
    console.error(error.message) 
    throw error;
  }

}


export default refreshToken;