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
        if (response.status === 200) {
            window.location.href = 'index.html'; 
        } else {
            document.getElementById('message').textContent = result.error;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    }
});
