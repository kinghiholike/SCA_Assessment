// Get the token from the URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    const response = await fetch('/users/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword, confirmNewPassword })
    });

    const result = await response.json();
    document.getElementById('message').textContent = result.message;
});