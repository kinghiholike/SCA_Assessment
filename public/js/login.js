// Attach an event listener to the 'loginForm' element for the 'submit' event
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Retrieve the values from the 'email' and 'password' input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Send a POST request to the server with the email and password in the request body
    const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicate that the request body contains JSON
        },
        body: JSON.stringify({ email, password }) // Convert email and password to JSON format for the request body
    });
  
    // Parse the JSON response from the server
    const result = await response.json();
  
    // Check if the response status is OK (status code in the range 200-299)
    if (response.ok) {
        // Store the authentication token in session storage
        sessionStorage.setItem('token', result.token);
        // Redirect the user to the profile page
        window.location.href = 'profile.html';
    } else {
        // Display an error message from the server
        document.getElementById('message').textContent = result.message;
    }
  });
  
  // Attach an event listener to the 'registerBtn' element for the 'click' event
  document.getElementById('registerBtn').addEventListener('click', () => {
      // Redirect the user to the registration page
      window.location.href = 'register.html';
  });
  