//34a75bef08004f789e548e709171c8822af6aec25b32260a169d2ac384746ecf8a01b6eb0ff56653d1e4fb5361e2f10495edea7ef56ef8d42884fea2b061e605



document.addEventListener('DOMContentLoaded', () => {
    const InputBox = document.querySelector('.input-box');
    const QuestionMark = document.getElementById("QuestionMark")
    QuestionMark.addEventListener('click', () => {
        window.location.href = 'https://discord.gg/yABfUbSSuZ'
    });

    InputBox.focus()
    async function ProccessEntry(){ //TODO make ratelimit
        const password = InputBox.value;
        const Req = `https://bayharbour.boats/authenticate?key=${password}`
        console.log("req: ", Req)
        const response = await fetch(Req);
        const result = await response.json();
        if (response.ok) {
            document.cookie = `session_token=${token}; HttpOnly; Secure; Max-Age=480;`
            console.log('Authentication successful:', result);
            document.body.classList.add('hidden')
            InputBox.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
            setTimeout(() => {
                window.location.href = "Pages/MainPage.html";
            }, 500)
        } else {
            InputBox.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
            setTimeout(() => {
                InputBox.style.boxShadow = '0 0 15px 0px #4b4b4b';
            }, 1000)
        }
    }
    
    InputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            ProccessEntry()
        }
    });


    const UnlockButton = document.querySelector('.unlock-button')
    UnlockButton.addEventListener('click', async () => { //TODO make rate limits
        ProccessEntry()
    });
})