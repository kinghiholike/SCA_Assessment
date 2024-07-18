// Get the token from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Attach an event listener to the 'resetPasswordForm' element for the 'submit' event
document.getElementById('resetPasswordForm').addEventListener('submit', async (event) => {
  
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve the values from the input fields
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;

  // Send a POST request to the server with the token and new password details in the request body
  const response = await fetch('/users/reset-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' // Indicate that the request body contains JSON
      },
      body: JSON.stringify({ token, newPassword, confirmNewPassword }) // Convert the data to JSON format for the request body
  });

  // Parse the JSON response from the server
  const result = await response.json();

  // Display the response message in the 'message' element
  document.getElementById('message').textContent = result.message;
});
