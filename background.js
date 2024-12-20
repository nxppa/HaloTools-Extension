function StartFetchingValidator() {
    setInterval(async () => {
        chrome.storage.local.get("session_token", (result) => {
            const Token = result.session_token; // Retrieve the session token
            console.log(Token);
            if (Token) {
                const req = `https://bayharbour.boats/validate?token=${Token}`;
                fetch(req)
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            } else {
                console.warn("No session token found in storage.");
            }
        });
    }, 500);
}
StartFetchingValidator();
