// Simple demo auth. Use secure auth for production.
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    const msg = document.getElementById('login-msg');

    if (u === 'user' && p === '1234') {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user', u);
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = '❌ Invalid credentials. Demo user: user / 1234';
    }
  });
}

// Protect pages by checking login status
// This part should be included in scripts for dashboard.html, reports.html, etc.
if (location.pathname.includes('dashboard') || location.pathname.includes('reports')) {
  if (localStorage.getItem('loggedIn') !== 'true') {
    // If not logged in, redirect to the login page.
    // Assuming your login page is index.html or login.html
    window.location.href = 'index.html'; 
  }
}

// Handle logout links
const logoutLink = document.getElementById('logoutLink');
const logoutLink2 = document.getElementById('logoutLink2');

function doLogout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user');
  // --- THIS IS THE FIX ---
  // After removing login data, redirect to the login page.
  window.location.href = 'index.html'; // Or your login page name
}

if (logoutLink) {
  logoutLink.addEventListener('click', doLogout);
}

if (logoutLink2) {
  logoutLink2.addEventListener('click', doLogout);
}