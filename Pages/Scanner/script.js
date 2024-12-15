window.addEventListener('load', () => {

    document.body.classList.add('visible');
    const InputBox = document.querySelector('input');
    async function QueryAccountDetails(){
        const Account = InputBox.value
        const Token = localStorage.getItem('session_token')
        const Req = `https://bayharbour.boats/api/tools/scanner?session_token=${Token}&account=${Account}` 
        console.log(Req)
        const Response = await fetch(Req)
        const result = await Response.json();

        console.log(result)
    }
    document.getElementById("search").addEventListener("click", () => {
        QueryAccountDetails()
    })
});
