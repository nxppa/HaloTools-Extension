const MyKey = "EYWsnfIKgPo2E"
const StructureMap = ["command", "subcommand", "parameter"]
const Commands = {
    "echo": {
        Aliases: ["print"],
        Structure: [0, 2],
        Executable: function(result){
            console.log(result)
            console.log("Echo response: ", result.parameter)
        },
        Description:"echoes whatever u put in the console"
    },
    "clear": {
        Aliases: ["cls"],
        Structure: [0],
        Executable: function(result){
            console.log("gotta add functionality")
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
                console.log("Importing wallet:", WalletInfo);
            }
        },
        Description:"allows you to mass import wallets"
    },
    "help": {
        Aliases: ["h", "-h", "-help"],
        Structure: [0, 2],
        Executable: function(result){
            if (!result.parameter) {
                Object.keys(Commands).forEach(cmd => {
                    console.log(`${cmd}: ${Commands[cmd].Description} | Aliases: ${Commands[cmd].Aliases.join(", ") || "None"}`);
                });
            } else {
                let commandKey = Object.keys(Commands).find(cmd => 
                    cmd === result.parameter || Commands[cmd].Aliases.includes(result.parameter)
                );
                if (commandKey) {
                    console.log(`${commandKey}: ${Commands[commandKey].Description} | Aliases: ${Commands[commandKey].Aliases.join(", ") || "None"}`);
                } else {
                    console.log("Unknown command");
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
        return { error: "Invalid input" };
    }
    let commandKey = Object.keys(Commands).find(cmd => 
        cmd === parts[0] || Commands[cmd].Aliases.includes(parts[0])
    );
    if (!commandKey) {
        return { error: "Unknown command" };
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
    const Executable = Commands[result.command].Executable
    Executable(result)
    return result;
}

const Wallets = `
HUpPyLU8KWisCAr3mzWy2FKT6uuxQ2qGgJQxyTpDoes5:0xSun;Hnnw2hAgPgGiFKouRWvM3fSk3HnYgRv4Xq1PjUEBEuWM:Gm5;5mtbmPwj2SMkxPP9c93s9oD9bmMdByTqepNarM9Y7u7e:Gm3;DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj:Euris
`


//parseCommand(`import ${Wallets}`)
parseCommand(`print hi`)