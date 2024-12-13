document.querySelector('.unlock-button').addEventListener('click', async () => {
    const password = document.querySelector('.input-box').value;

    // Send the password to the server for verification
    const response = await fetch('https://your-api.com/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), // Send password in JSON format
    });

    const result = await response.json();

    if (response.ok) {
        console.log('Authentication successful:', result);
        // Proceed to authenticated area
    } else {
        console.error('Authentication failed:', result);
        alert('Invalid password!');
    }
});
