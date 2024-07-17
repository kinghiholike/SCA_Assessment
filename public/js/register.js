document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const response = await fetch('/users/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
  });

  const result = await response.json();
  document.getElementById('message').textContent = result.message;

  if (response.ok) {
      // Registration successful, redirect to login page
      window.location.href = 'login.html';
  }
});
