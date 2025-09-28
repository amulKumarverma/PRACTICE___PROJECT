// assets/js/signup.js

document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('signup-msg');

    // Basic validation
    if (password !== confirmPassword) {
        messageEl.textContent = 'Passwords do not match.';
        messageEl.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageEl.textContent = 'Account created successfully! Redirecting to login...';
            messageEl.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000); // Wait 2 seconds before redirecting
        } else {
            messageEl.textContent = data.message || 'An error occurred.';
            messageEl.style.color = 'red';
        }
    } catch (error) {
        messageEl.textContent = 'Failed to connect to the server.';
        messageEl.style.color = 'red';
        console.error('Error:', error);
    }
});