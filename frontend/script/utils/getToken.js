function getAccessToken() {
  const token = sessionStorage.getItem('accessToken');

  if(!token) window.location.href= '../login.html'

  return token;
}

export default getAccessToken;