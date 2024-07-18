document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        sessionStorage.setItem('token', result.token);
        window.location.href = 'profile.html';
    } else {
        document.getElementById('message').textContent = result.message;
    }
});

// Handle click event for register button (if using button)
document.getElementById('registerBtn').addEventListener('click', () => {
    window.location.href = 'register.html';
});
