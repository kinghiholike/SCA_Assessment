document.getElementById('getUserInfo').addEventListener('click', async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        document.getElementById('message').textContent = 'User not authenticated';
        return;
    }

    const response = await fetch('/users/getUser', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('userInfo').textContent = `Email: ${result.email}, Name: ${result.firstName} ${result.lastName}`;
    } else {
        document.getElementById('message').textContent = result.message;
    }
});
