// Attach an event listener to the 'forgotPasswordForm' element for the 'submit' event
document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
  
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve the value from the 'email' input field
  const email = document.getElementById('email').value;

  // Send a POST request to the server with the email in the request body
  const response = await fetch('/users/forgot-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' // Indicate that the request body contains JSON
      },
      body: JSON.stringify({ email }) // Convert the email to JSON format for the request body
  });

  // Parse the JSON response from the server
  const result = await response.json();

  // Update the text content of the 'message' element with the response message
  document.getElementById('message').textContent = result.message;
});
