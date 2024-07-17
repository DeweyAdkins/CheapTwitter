document.querySelector('#createUserForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.querySelector('#newUsername').value;
    const password = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('message').textContent = 'Passwords do not match!';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        console.log("Response received");

        if (response.status === 201) {
            console.log("Before redirection");
            window.location.href = 'indexlog.html'; // Redirect to login page
        } else {
            document.getElementById('message').textContent = result.error;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    }
    console.log("End of submit handler");
});
