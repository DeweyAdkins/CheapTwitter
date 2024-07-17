document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // For demo purposes, we simply log the inputs.
    console.log('Username:', username);
    console.log('Password:', password);

    // TODO: Add your authentication logic here

    // Set loggedIn flag in localStorage
    localStorage.setItem('loggedIn', 'true');

    // Redirect to main page on successful login
    window.location.href = 'index.html';
});