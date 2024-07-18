// Event listener that executes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve the authentication token from session storage
    const token = sessionStorage.getItem('token');

    // If no token is found, redirect to the login page
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch user data from the server, including the token in the Authorization header
        const response = await fetch('/users/getUser', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the request header
                'Content-Type': 'application/json' // Specify that the response is in JSON format
            }
        });

        // Throw an error if the response is not OK
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        // Parse the JSON response to get user data
        const user = await response.json();

        // Update the HTML elements with user data
        document.getElementById('email').textContent = user.email;
        document.getElementById('firstName').textContent = user.firstName;
        document.getElementById('lastName').textContent = user.lastName;
    } catch (error) {
        // Log any errors to the console
        console.error('Error:', error);
        // Remove the token from session storage and redirect to the login page
        sessionStorage.removeItem('token');
        window.location.href = 'login.html';
    }
});

// Event listener for the logout button click event
document.getElementById('logoutButton').addEventListener('click', () => {
    // Remove the token from session storage
    sessionStorage.removeItem('token');
    // Redirect to the login page
    window.location.href = 'login.html';
});
