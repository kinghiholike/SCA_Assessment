document.getElementById('forgotPasswordForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;

  const response = await fetch('/users/forgot-password', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
  });

  const result = await response.json();
  document.getElementById('message').textContent = result.message;
});
