// Attach an event listener to the 'registerForm' element for the 'submit' event
document.getElementById('registerForm').addEventListener('submit', async (event) => {
  
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Retrieve the values from the input fields
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Send a POST request to the server with the registration details in the request body
    const response = await fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicate that the request body contains JSON
        },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }) // Convert registration details to JSON format for the request body
    });
  
    // Parse the JSON response from the server
    const result = await response.json();
  
    // Display the response message in the 'message' element
    document.getElementById('message').textContent = result.message;
  
    // If the registration is successful, redirect to the login page
    if (response.ok) {
        window.location.href = 'login.html';
    }
  });
  