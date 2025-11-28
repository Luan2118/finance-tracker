import { API_BASE_URL } from "./apiConfig.js";

async function refreshToken() {

  try {
    const response = await fetch(`${API_BASE_URL}/login/refresh`, {
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