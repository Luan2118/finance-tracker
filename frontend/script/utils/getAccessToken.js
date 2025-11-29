function getAccessToken() {
  const token = sessionStorage.getItem('accessToken');
  
  
  if(!token) window.location.href= 'index.html'

  return token;
}

export default getAccessToken;