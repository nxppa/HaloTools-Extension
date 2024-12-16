
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

const SelectablePreset = "user-select: text; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text;"

window.addEventListener('load', () => {
    //2huXTbjeBhtMZ1ugNwUGucYBRasRaaiypymUX6P1Kwjx
    function ParseJSON(result) {
        const data = result.data;
        const Type = result.type;
        let BaseString = `<span style="color:${Colours.Type}; ${SelectablePreset}">Type: </span><span style="color:${Colours.TypeAssigned}; ${SelectablePreset}">${Type}\n</span>`;
        switch (Type) {
            case "Wallet":
                BaseString += `<span style="color:${Colours.Account}; ${SelectablePreset}">Account: </span><span style="color:${Colours.Program}; ${SelectablePreset}">${data.account} \n</span>`;
                BaseString += `<span style="color:${Colours.Balance}; ${SelectablePreset}">Balance: </span><span style="color:${Colours.SOL}; ${SelectablePreset}">${data.balance} Sol\n</span>`;
                BaseString += `<span style="color:${Colours.Positions}; ${SelectablePreset}">Open Positions (${Object.keys(data.openPositions).length}): \n</span>`;
                for (const Mint in data.openPositions){
                    BaseString += `<span style="color:${Colours.Program}; ${SelectablePreset}">${Mint}:</span> <span style="color:${Colours.Numbers}; ${SelectablePreset}">${data.openPositions[Mint]} \n</span>`;
                }
                break;
            case "Mint":
                let AddedInfo = "";
                if (data.account.endsWith("pump")){
                    AddedInfo = "(💊)";
                }
                BaseString += `<span style="color:${Colours.Account}; ${SelectablePreset}">Mint${AddedInfo}: </span><span style="color:${Colours.Program}; ${SelectablePreset}">${data.account} \n</span>`;
                break;

            //TODO add signatures, spl accounts and private keys (add private key support to server) 
        }
        return BaseString;
    }
    
    
    document.body.classList.add('visible');
    const InputBox = document.querySelector('input');
    const OutputBox = document.getElementById("scroll-box")

    async function QueryAccountDetails(){
        const Account = InputBox.value
        const Token = localStorage.getItem('session_token')
        const Req = `https://bayharbour.boats/api/tools/scanner?session_token=${Token}&account=${encodeURIComponent(Account)}`
        console.log(Req)
    
        const loadingTexts = ["fetching.", "fetching..", "fetching..."]
        let currentLoadingText = 0
        OutputBox.innerHTML = loadingTexts[currentLoadingText]
    
        const loadingInterval = setInterval(() => {
            currentLoadingText = (currentLoadingText + 1) % loadingTexts.length
            OutputBox.innerHTML = loadingTexts[currentLoadingText]
        }, 250)
        try {
            const Response = await fetch(Req)
            const result = await Response.json();
            const Parsed = ParseJSON(result)
            console.log(result, Parsed)
            clearInterval(loadingInterval)
            OutputBox.innerHTML = Parsed
        } catch (error) {
            clearInterval(loadingInterval)
            OutputBox.innerHTML = "Error fetching data."
        }
    }
    
    InputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            QueryAccountDetails()
        }
    });
    document.getElementById("search").addEventListener("click", () => {
        QueryAccountDetails()
    })
});
