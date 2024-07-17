document.getElementById('createUserForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // For demo purposes, we simply log the inputs.
    console.log('New Username:', newUsername);
    console.log('New Password:', newPassword);

    // TODO: Add your user creation logic here

    // Redirect to login page on successful creation
    window.location.href = 'indexlog.html';
});
