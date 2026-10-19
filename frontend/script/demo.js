import { API_BASE_URL } from './utils/apiConfig.js';

const demoLogin = document.getElementById('demo-login');
const status = document.getElementById('demo-status');
const errorMessage = document.getElementById('demo-error');
const retryButton = document.getElementById('demo-retry');

async function loginDemo() {
  demoLogin.setAttribute('aria-busy', 'true');
  status.textContent = 'Signing you into the demo. This may take a moment.';
  errorMessage.hidden = true;
  retryButton.hidden = true;
  retryButton.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/login/demo`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(response.status === 503
        ? 'The demo account is currently unavailable. Please try again later.'
        : 'Could not open the demo. Please try again.');
    }

    const result = await response.json();
    if (typeof result.accessToken !== 'string' || !result.accessToken.trim()) {
      throw new Error('Could not open the demo. Please try again.');
    }

    sessionStorage.setItem('accessToken', result.accessToken);
    window.location.replace('dashboard.html');
  } catch (error) {
    status.textContent = '';
    errorMessage.textContent = error instanceof TypeError
      ? 'Could not connect to the demo. Check your connection and try again.'
      : error.message;
    errorMessage.hidden = false;
    retryButton.hidden = false;
  } finally {
    demoLogin.setAttribute('aria-busy', 'false');
    retryButton.disabled = false;
  }
}

retryButton.addEventListener('click', loginDemo);
loginDemo();
