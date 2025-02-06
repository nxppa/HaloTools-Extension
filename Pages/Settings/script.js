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
        Description:"  clears console"
    },
    "import": {
        Aliases: ["addwallets"],
        Structure: [0, 2],
        Executable: function(result){
            let parts = result.parameter.split(';');
            let walletsArray = [];
            for (let i = 0; i < parts.length; i++) {
                let entry = parts[i];
                let subParts = entry.split(':');
                walletsArray.push({ address: subParts[0], alias: subParts[1] });
            }
            for (let i = 0; i < walletsArray.length; i++) {
                const WalletInfo = walletsArray[i];
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
                BaseWalletTemplate.Alias = WalletInfo.alias;
                post(`https://bayharbour.boats/newWallet?key=${MyKey}&account=${WalletInfo.address}`, BaseWalletTemplate)
                Display("Importing wallet: " + JSON.stringify(WalletInfo));
            }
        },
        Description:"allows you to mass import wallets"
    },
    "export": {
        Aliases: ["exportwallets"],
        Structure: [0, 2],
        Executable: function(result){
            // Export functionality here
        },
        Description:"exports wallet data as a string"
    },
    "axe": {
        Aliases: ["removewallets"],
        Structure: [0, 2],
        Executable: function(result){
            // Remove wallets functionality here
        },
        Description:"removes all copying wallets"
    },
    "help": {
        Aliases: ["-help",".help", "h", "-h", ".h"],
        Structure: [0, 2],
        Executable: function(result){
            if (!result.parameter) {
                Object.keys(Commands).forEach(cmd => {
                    const cmdData = Commands[cmd];
                    Display(`${cmd}: ${cmdData.Description} | Aliases: ${cmdData.Aliases.join(", ") || "None"}`);
                });
            } else {
                let commandKey = Object.keys(Commands).find(cmd => 
                    cmd === result.parameter || Commands[cmd].Aliases.indexOf(result.parameter) !== -1
                );
                if (commandKey) {
                    const cmdData = Commands[commandKey];
                    let structure = "";
                    for (let i = 0; i < cmdData.Structure.length; i++) {
                        structure += StructureMap[cmdData.Structure[i]];
                        if (i < cmdData.Structure.length - 1) {
                            structure += ", ";
                        }
                    }
                    Display(`${commandKey}: ${cmdData.Description} | Aliases: ${cmdData.Aliases.join(", ") || "None"}`);
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
        cmd === parts[0] || Commands[cmd].Aliases.indexOf(parts[0]) !== -1
    );
    if (!commandKey) {
        Display(`unknown command "${parts[0]}"`)
        return { error: `Unknown command "${parts[0]}"`};
    }
    let commandDef = Commands[commandKey];
    let result = { command: commandKey };
    if (commandDef.Structure.indexOf(1) !== -1 && parts.length > 1) {
        result.subcommand = parts[1];
    }
    if (commandDef.Structure.indexOf(2) !== -1) {
        if (commandDef.Structure.indexOf(1) !== -1 && parts.length > 2) {
            result.parameter = parts.slice(2).join(" ");
        } else if (commandDef.Structure.indexOf(1) === -1 && parts.length > 1) {
            result.parameter = parts.slice(1).join(" ");
        }
    }
    return Commands[result.command].Executable(result)
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
