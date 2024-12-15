
const Colours = {
    "Numbers": "#8eff93",
    "Type": "#8eff93",
    "TypeAssigned": "#ffb978",
    "Positions": "",
    "SOL": "#c054ff",
    "Account": "#8eff93",
    "Program": "#FFBD59",
    "Balance": "#8eff93"
}


window.addEventListener('load', () => {
    //2huXTbjeBhtMZ1ugNwUGucYBRasRaaiypymUX6P1Kwjx
    function ParseJSON(result) {
        const data = result.data
        const Type = result.type
        let BaseString = `<span style="color:${Colours.Type};">Type: </span><span style="color:${Colours.TypeAssigned};">${Type}<br></span>`
        switch (Type) {
            case "Wallet":
                BaseString += `<span style="color:${Colours.Account};">Account: </span><span style= "color:${Colours.Program};">${data.account} <br></span>`
                BaseString += `<span style="color:${Colours.Balance};">Balance: </span> <span style="color:${Colours.SOL};">${data.balance} Sol<br></span>`
                BaseString += `<span style="color:${Colours.Positions};">Open Positions (${Object.keys(data.openPositions).length}): <br></span>`
                for (const Mint in data.openPositions){
                    BaseString += `<span style= "color:${Colours.Program};">${Mint}:</span> <span style="color:${Colours.Numbers};">${data.openPositions[Mint]} <br></span>`
                }
                break
            case "Mint":
                let AddedInfo = ""
                if (data.account.endsWith("pump")){
                    AddedInfo = "(💊)"
                }
                BaseString += `<span style="color:${Colours.Account};">Mint${AddedInfo}: </span><span style= "color:${Colours.Program};">${data.account} <br></span>`
                break
            }
        return BaseString
    
    }
    
    document.body.classList.add('visible');
    const InputBox = document.querySelector('input');
      const OutputBox = document.getElementById("scroll-box")

    async function QueryAccountDetails(){
        const Account = InputBox.value
        const Token = localStorage.getItem('session_token')
        const Req = `https://bayharbour.boats/api/tools/scanner?session_token=${Token}&account=${Account}` 
        console.log(Req)
        const Response = await fetch(Req)
        const result = await Response.json();
        const Parsed = ParseJSON(result)
        console.log(result, Parsed)
        OutputBox.innerHTML = Parsed
    }
    document.getElementById("search").addEventListener("click", () => {
        QueryAccountDetails()
    })
});
