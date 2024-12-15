//34a75bef08004f789e548e709171c8822af6aec25b32260a169d2ac384746ecf8a01b6eb0ff56653d1e4fb5361e2f10495edea7ef56ef8d42884fea2b061e605
//Nappa


//b5f6ec4f48891b1cdd57fdedcd70b06efc21e34ffaccfce97f69bbe359885f7463e9ca3034ee89426ce396fba680ddca34b36797eb11164ebe0f8918ed615afd
//sanya



function SemanticalVerify(key) { //TODO make it semantically verify based on length or whatever
    if (!key) {
        return false
    }

    return true
}


const AuthTimeMins = 8
window.addEventListener('unload', () => {
    const Token = localStorage.getItem('session_token')
    const req = `https://bayharbour.boats/validate?token=${Token}`
    fetch(req)
 })
 chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "popup") {
        port.onDisconnect.addListener(function() {
            const req = `https://bayharbour.boats/validate?token=${Token}`
            fetch(req)
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    function ClearToken() {
        localStorage.removeItem('session_token');
        document.cookie = 'session_token=; Max-Age=0; path=/';
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
    async function OpenMainPage() {
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
            const req = `https://bayharbour.boats/validate?token=${Token}`
            console.log("validate req: ", req)
            const Response = await fetch(req)
            console.log(Response)
            const result = await Response.json();
            if (result.success) {
                SetToken(result.token)
                console.log(result)
                OpenMainPage()
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
    async function ProccessEntry() { //TODO make ratelimit
        const password = InputBox.value;
        if (SemanticalVerify(password)){
            const Req = `https://bayharbour.boats/authenticate?key=${password}` 
            console.log("req: ", Req)
            const response = await fetch(Req);
            const result = await response.json();
            if (response.ok) {
                SetToken(result.token)
                console.log(result.token)
                console.log('Authentication successful:', result);
                OpenMainPage()
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
    UnlockButton.addEventListener('click', async () => { //TODO make rate limits
        ProccessEntry()
    });
})