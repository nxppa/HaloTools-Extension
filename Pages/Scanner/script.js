
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

const SpecialTokens = {
    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "USDC",
    So11111111111111111111111111111111111111112: "WSOL",
    Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "USDT",
    HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr: "EURC",
  }
const SelectablePreset = "user-select: text; -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text;"

function sortOpenPositions(openPositions, specialTokens) {
    const special = [];
    const regular = [];
    const pump = [];
  
    for (const [mint, amount] of Object.entries(openPositions)) {
      if (specialTokens[mint]) {
        special.push({ mint, amount });
      } else if (mint.endsWith("pump")) {
        pump.push({ mint, amount });
      } else {
        regular.push({ mint, amount });
      }
    }
    special.sort((a, b) => b.amount - a.amount);
    regular.sort((a, b) => b.amount - a.amount);
    pump.sort((a, b) => b.amount - a.amount);
    const sorted = [...special, ...regular, ...pump].map(item => item.mint);
    return sorted;
  }
window.addEventListener('load', () => {
    //* "If you make something so clusterfucked he can't understand it, he's gonna think you're a god" -- Terry A Davis *\\
    function ParseJSON(result) {
        const data = result.data;
        const Type = result.type;
        let BaseString = `<span style="color:${Colours.Type}; ${SelectablePreset}">Type: </span><span style="color:${Colours.TypeAssigned}; ${SelectablePreset}">${Type}\n</span>`;
        switch (Type) {
            case "Wallet":
                BaseString += `<span style="color:${Colours.Account}; ${SelectablePreset}">Account: </span><span style="color:${Colours.Program}; ${SelectablePreset}">${data.account} \n</span>`;
                BaseString += `<span style="color:${Colours.Balance}; ${SelectablePreset}">Balance: </span><span style="color:${Colours.SOL}; ${SelectablePreset}">${data.balance} Sol\n</span>`;
                BaseString += `<span style="color:${Colours.Positions}; ${SelectablePreset}">Open Positions (${Object.keys(data.openPositions).length}): \n</span>`;
                
                for (const Mint of sortOpenPositions(data.openPositions, SpecialTokens)){
                    let AddedInfo = "(🪙)";
                    let SpecialMint = SpecialTokens[Mint]
                    if (Mint.endsWith("pump")){
                        AddedInfo = "(💊)";
                    } else if (SpecialMint){
                        AddedInfo = `(✨)`
                    } 

                    BaseString += `<span style="color:${Colours.Program}; ${SelectablePreset}">${AddedInfo}${Mint}:</span> <span style="color:${Colours.Numbers}; ${SelectablePreset}">${data.openPositions[Mint]} \n</span>`;
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

//TODO add functionality to copy + download