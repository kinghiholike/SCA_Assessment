document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/users/getUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await response.json();

        document.getElementById('email').textContent = user.email;
        document.getElementById('firstName').textContent = user.firstName;
        document.getElementById('lastName').textContent = user.lastName;
    } catch (error) {
        console.error('Error:', error);
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    sessionStorage.removeItem('token');
    window.location.href = 'login.html';
});
