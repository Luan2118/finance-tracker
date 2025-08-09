async function refreshToken() {

  try {
    const response = await fetch('http://localhost:3000/login/refresh', {
      method: 'POST',
      credentials: 'include'
    })
  
    let result = await response.json();
  
    if(!response.ok) console.error(error.message)

    return result.accessToken;

  } catch (error) {
    console.error(error.message) 
  }

}


export default refreshToken;