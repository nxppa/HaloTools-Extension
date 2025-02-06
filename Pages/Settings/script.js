const MyKey = "EYWsnfIKgPo2E"
const StructureMap = ["command", "subcommand", "parameter"]
let OutputBox = null
function Display(Text){
    const TextBox = document.createElement("div")
    TextBox.className = "OutputText"
    TextBox.innerHTML = `<span style="color:white">${Text}</span>`
    OutputBox.appendChild(TextBox)
}
const Commands = {
    "echo": {
        Aliases: ["print"],
        Structure: [0, 2],
        Executable: function(result){
            Display(`Echo response: ${result.parameter}`)
        },
        Description:"echoes whatever u put in the console"
    },
    "clear": {
        Aliases: ["cls"],
        Structure: [0],
        Executable: function(result){
            while (OutputBox.firstChild) {
                OutputBox.removeChild(OutputBox.firstChild);
            }
        },
        Description:"clears console"
    },
    "import": {
        Aliases: ["addwallets"],
        Structure: [0, 2],
        Executable: function(result){
            let walletsArray = result.parameter.split(';').map(entry => {
                let [address, alias] = entry.split(':');
                return { address, alias };
            });
            for(const WalletInfo of walletsArray){
                let BaseWalletTemplate = {
                    "PriorityFee": 0.0001,
                    "MaxProportionSpending": 0.05,
                    "MinimumSpending": 0.1,
                    "MaxMarketCap": 0.04,
                    "Halted": true,
                    "Alias": "Alias",
                    "Valid": false,
                    "RecentTransactions": []
                }
                BaseWalletTemplate.Alias = WalletInfo.alias
                post(`https://bayharbour.boats/newWallet?key=${MyKey}&account=${WalletInfo.address}`, BaseWalletTemplate)
                Display("Importing wallet:", WalletInfo);
            }
        },
        Description:"allows you to mass import wallets"
    },
    
    "export": {
        Aliases: ["exportwallets"],
        Structure: [0, 2],
        Executable: function(result){

        },
        Description:"exports wallet data as a string"
    },
    "axe": {
        Aliases: ["removewallets"],
        Structure: [0, 2],
        Executable: function(result){
            
        },
        Description:"removes all copying wallets"
    },
    "help": {
        Aliases: ["-help",".help", "h", "-h", ".h"],
        Structure: [0, 2],
        Executable: function(result){
            if (!result.parameter) {
                Object.keys(Commands).forEach(cmd => {
                    Display(`${cmd}: ${Commands[cmd].Description} | Aliases: ${Commands[cmd].Aliases.join(", ") || "None"}`);
                });
            } else {
                let commandKey = Object.keys(Commands).find(cmd => 
                    cmd === result.parameter || Commands[cmd].Aliases.includes(result.parameter)
                );
                if (commandKey) {
                    Display(`${commandKey}: ${Commands[commandKey].Description} | Aliases: ${Commands[commandKey].Aliases.join(", ") || "None"} `);
                } else {
                    Display("Unknown command");
                }
            }
        },
        Description: "lists all commands or provides info on a specific command"
    }
};

async function post(URL, body) {
    body = body || {};
    return await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}
function parseCommand(input) {
    let parts = input.trim().split(/\s+/);
    if (parts.length === 0 || parts[0] === '') {
        Display("Invalid input")
        return { error: "Invalid input" };
    }
    let commandKey = Object.keys(Commands).find(cmd => 
        cmd === parts[0] || Commands[cmd].Aliases.includes(parts[0])
    );
    if (!commandKey) {
        Display(`unknown command "${parts[0]}"`)
        return { error: `Unknown command "${parts[0]}"` };
    }
    let commandDef = Commands[commandKey];
    let result = { command: commandKey };
    if (commandDef.Structure.includes(1) && parts.length > 1) {
        result.subcommand = parts[1];
    }
    if (commandDef.Structure.includes(2)) {
        if (commandDef.Structure.includes(1) && parts.length > 2) {
            result.parameter = parts.slice(2).join(" ");
        } else if (!commandDef.Structure.includes(1) && parts.length > 1) {
            result.parameter = parts.slice(1).join(" ");
        }
    }
    Commands[result.command].Executable(result)
    return result;
}



window.addEventListener('load', () => {
    document.body.classList.add('visible');
    const InputBox = document.querySelector('input');
    OutputBox = document.getElementById("scroll-box")
    OutputBox.removeChild(OutputBox.firstChild);
    const Copy = document.getElementById("Copy")
    function EnterCommand(){
        const Command = InputBox.value
        parseCommand(Command)
        InputBox.value = ""

    }
    Copy.addEventListener("click", () => {
        const textToCopy = OutputBox.textContent || OutputBox.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
        Copy.src = CheckAsset
        setTimeout(() => {
            Copy.src = CopyAsset
        }, 500)
    })

    InputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            EnterCommand()
        }
    });
    document.getElementById("search").addEventListener("click", () => {
        EnterCommand()
    })
});