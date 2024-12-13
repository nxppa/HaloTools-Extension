//34a75bef08004f789e548e709171c8822af6aec25b32260a169d2ac384746ecf8a01b6eb0ff56653d1e4fb5361e2f10495edea7ef56ef8d42884fea2b061e605
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('.unlock-button').addEventListener('click', async () => { //TODO make rate limits
        console.log("pressed unlock")
        const password = document.querySelector('.input-box').value;
        const Req = `https://bayharbour.boats/authenticate?key=${password}`
        console.log("req: ", Req)
        const response = await fetch(Req);
        const result = await response.json();
        if (response.ok) {
            console.log('Authentication successful:', result);
            document.body.classList.add('hidden')
            setTimeout(() => {
                window.location.href = "Pages/MainPage.html";
            }, 500)

        } else {
            const box = document.querySelector('.input-box');
            box.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';

            // Fade back to original shadow after 1 second
            setTimeout(() => {
                box.style.boxShadow = '0 0 15px 0px #4b4b4b';
            }, 1000); // Match the transition duration
        }
    });
})