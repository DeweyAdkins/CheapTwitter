document.querySelector('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        const messageElement = document.getElementById('message');

        if (response.status === 200) {
            localStorage.setItem('loggedIn',true);
            messageElement.textContent = result.message;
            window.location.href = 'index.html'; // Redirect to the main page immediately
        } else {
            messageElement.textContent = result.error;
        }
    } catch (error) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'An error occurred. Please try again.';
    }
});