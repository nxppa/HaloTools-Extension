//9WD3qzitzuC1r
//EYWsnfIKgPo2E
//TODO make it so that session key is renewed every few seconds while extension open 

function SemanticalVerify(key) { //TODO make it semantically verify based on length or whatever
    if (!key) {
        return false
    }

    return true
}


const AuthTimeMins = 8


document.addEventListener('DOMContentLoaded', () => {
    function ClearToken() {
        localStorage.removeItem('session_token');
        document.cookie = 'session_token=; Max-Age=0; path=/';
    }
    async function UpdateUserData(Token){
        const req = `https://bayharbour.boats/getData?session_token=${Token}` 
        const Response = await fetch(req)
        const JSONRes = await Response.json()
        
        const Stringified = JSON.stringify(JSONRes)
        alert(Stringified)

        if (Response){
            localStorage.setItem('UserData', Stringified);
        } 
    }

    const History = window.history
    if (History.length > 1){
        //! came from page
        //TODO make it invalidate token on server if here
        ClearToken()
    }
    async function SetToken(Token) {
        localStorage.setItem('session_token', Token);
        document.cookie = `session_token=${Token}; HttpOnly; Secure; Max-Age=${AuthTimeMins * 60};`
    }
    async function OpenMainPage(Token) {
        UpdateUserData(Token)
        document.body.classList.add('hidden')
        InputBox.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';
        setTimeout(() => {
            window.location.href = "Pages/Main/MainPage.html";
        }, 250)
    }
    async function KeyFailure(){
        InputBox.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.8)';
        setTimeout(() => {
            InputBox.style.boxShadow = '0 0 15px 0px #4b4b4b';
        }, 1000)
    }
    async function ValidateOnLoad() {
        const Token = localStorage.getItem('session_token')
        if (Token) {
            console.log(Token)
            const req = `https://bayharbour.boats/validate?session_token=${Token}`
            console.log("validate req: ", req)
            const Response = await fetch(req)
            console.log(Response)
            const result = await Response.json();
            if (result.success) {
                SetToken(result.token)
                console.log(result)
                OpenMainPage(result.token)
            } else {
            }
        } else {
            console.log("no token")
        }
    }
    ValidateOnLoad()
    const InputBox = document.querySelector('.input-box');
    const QuestionMark = document.getElementById("QuestionMark")
    QuestionMark.addEventListener('click', () => {
        window.location.href = 'https://discord.gg/yABfUbSSuZ'
    });

    InputBox.focus()
    async function ProccessEntry() {
        const password = InputBox.value;
        if (SemanticalVerify(password)){ //TODO make rate limits on client and server
            const Req = `https://bayharbour.boats/authenticate?key=${password}` 
            console.log("req: ", Req)
            const response = await fetch(Req);
            const result = await response.json();
            if (response.ok) {
                SetToken(result.token)
                console.log(result.token)
                console.log('Authentication successful:', result);
                OpenMainPage(result.token)
                return
            }
        }
        KeyFailure()
    }

    InputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            ProccessEntry()
        }
    });


    const UnlockButton = document.querySelector('.unlock-button')
    UnlockButton.addEventListener('click', async () => {
        ProccessEntry()
    });
})