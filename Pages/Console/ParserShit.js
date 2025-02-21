const MyKey = "EYWsnfIKgPo2E"
const StructureMap = ["command", "subcommand", "parameter"]
let OutputBox = null
//import 9UWZFoiCHeYRLmzmDJhdMrP7wgrTw7DMSpPiT2eHgJHe:BIG APES;m7Kaas3Kd8FHLnCioSjCoSuVDReZ6FDNBVM6HTNYuF7:FERB📈;3Ve46xYmZTKExr3FmCLYMA5Xt12DkDKgK7AeNUhcc5cc:SYDNEY;9ru9BSVFSUqSRQFwdjjnkzQGf9yUdpRTjpjXPKc4BvxX:FERB2📉;2aBNovJPA4nycxwTw56gm265yr9UAMrCvqnCJfq5R6c3:Raydium;RFSqPtn1JfavGiUD4HJsZyYXvZsycxf31hnYfbyG6iB:PATTY🤣;8Q3p7w5x1PXyy99kPxEsgrdkp1ExtCyUAzGeXGqMXL8E:holyfuck;B3wagQZiZU2hKa5pUCj6rrdhWsX3Q6WfTTnki9PjwzMh:xander;2qEfLrtjf8J9bdoysAXny5Nh821ceUy5doNdbQA6tsQg:🫡 1;3rSZJHysEk2ueFVovRLtZ8LGnQBMZGg96H2Q4jErspAF:staqi(farmer) (if he buys at raydium);4wCbXaGsdXUEw4nqwXFcNKoiZpcUwbDjyHKxaTergUwd:🫡 2;GzNus5Ka6kjJrqKCJRHmEVLiAS3HJ9RrBp1mdnxqGXTb:goatse✨ (if buys at ray);suqh5sHtr8HyJ7q8scBimULPkPpA557prMG47xCHQfK:(danny, high risk high reward);Fxj1j5ohVoRos1yQnvx6bsvYCt493VGpyLbMiq4eLff3:solshotta;4632BMWY69AkVHxN1XLKVuLrednYiLccuMeoXnQBMA7Z:Insider buys, jeets early sometimes;8yJFWmVTQq69p6VJxGwpzW7ii7c5J9GRAtHCNMMQPydj:raygod;9jyqFiLnruggwNn4EQwBNFXwpbLM9hrA4hV59ytyAVVz:Nach(narrative buys);GFJhtZuENEB9StZiacHUd1aoBoCtY2wWLskhgwcyfaYN:ansem alt;9NNS758mUGByRcFBSD79fLn2mYL3PGM9G9J5RjBV3kD4:70pnl;8deJ9xeUvXSJwicYptA9mHsU2rN2pDx37KWzkDkEXhU6:cooker flips;7VBTpiiEjkwRbRGHJFUz6o5fWuhPFtAmy8JGhNqwHNnn:brox;BkLsbxUeUEP3Yytdt2m84BzSKMnex9qn5HtERmYWqv8Q:aroa;DfMxre4cKmvogbLrPigxmibVTTQDuzjdXojWzjCXXhzj:Euris(high risk, very high reward);D4zVhwuUsFbcaty7wJhNEZ7VEwPHXQ5d2heXPxM5yWhL:;6BJ8YTiiDdSxy7RNLHd4hurmvUjreRFoxLGKYftAGb4x:narrative buyer;CRVidEDtEUTYZisCxBZkpELzhQc9eauMLR3FWg74tReL:frank degods;DNfuF1L62WWyW3pNakVkyGGFzVVhj4Yr52jSmdTyeBHm:gake;HrWt6V3kjv26bfUTzBroVAp87W62AWD3LsRfsNdgXJrc:Erik Stevens;AVAZvHLR2PcWpDf8BXY4rVxNHYRBytycHkcB5z5QNXYm:ANSEM;FpCgGwrowtdTM8hhHtP3o2shRJqThpnodEk3JG1bkPfx:jingtao;5Uu7axHrgsv5BaWPgW1pk2foWzNf2didkPPHjchHMHH3:100wr insider;831qmkeGhfL8YpcXuhrug6nHj1YdK3aXMDQUCo85Auh1:80wr 250k30d;D18EmaqFyXJ35GA9XP41qecF72JsyJNo6ZtrTDfi5xGH:80wr 150k30d;D2Kr1NoMdPMCHSea55SsWgTsJRp1KkQtPgAyk5WsLqCt:77wr 5kwrd;4J5rDTvRbzjuKkB4B9rvNEvDz6f1BEBzUVT5mdctKHoT:75wr odd;HUpPyLU8KWisCAr3mzWy2FKT6uuxQ2qGgJQxyTpDoes5:73wr 150k7d;5B52w1ZW9tuwUduueP5J7HXz5AcGfruGoX6YoAudvyxG:72wr 150k30d;6jfC9p4jzTBTGpMrbR8H464kNo1SBGNCW17oDETzSJrf:Darkfarms;8zFZHuSRuDpuAR7J6FzwyF3vKNx4CVW3DFHJerQhc7Zd:POW;26kZ9rg8Y5pd4j1tdT4cbT8BQRu5uDbXkaVs3L5QasHy:ORANGIE;4MAcnf87x9aP8jrKvWafEjvbcGGmixXw8Xk2JjHJ7zjU:Idk;D2wBctC1K2mEtA17i8ZfdEubkiksiAH2j8F7ri3ec71V:Dior;AMTmcPLHDQ6NU8AVjVkGqN15HyNkTsnAPREGodLCMpVS:Slip;3tod4efVpW11sLNR7HPke6o5fWuhPFtAmy8JGhNqwHNnn:Alpha;8MaVa9kdt3NW4Q5HyNAm1X5LbR8PQRVDc1W8NMVK88D5:Daumen;3jLij9WF7AUXnQsj3ve19kej42oEuJnmzGsnxo4R8UCR:Raves;GQWLRHtR18vy8myoHkgc9SMcSzwUdBjJ816vehSBwcis:Joji;HdxkiXqeN6qpK2YbG51W23QSWj3Yygc1eEk2zwmKJExp:Itai;HrTZPWV4ZPebBiwyzoTBajCD49kQqVwf4dwsLuYG8CXX:Killz;6LChaYRYtEYjLEHhzo4HdEmgNwu2aia8CM8VhR9wn6n7:Assassin;FMZaFX16Gc9kPcVi5w4y8Ywr2mUCsjKdQrNgLrSgaUfg:Smart Wallet;4aDdi3EiDPMbeZ3e5BvbFMt4vfJaoahaHxZuwKQRtFc1:Nach2;ECCKBDWX3MkEcf3bULbLBb9FvrEQLsmPMFTKFpvjzqgP:Kenzo;4YzpSZpxDdjNf3unjkCtdWEsz2FL5mok7e5XQaDNqry8:China Quant;orcACRJYTFjTeo2pV8TfYRTpmqfoYgbVi9GeANXTCc8:Orca;DGPYpCdiVg2shab2TnNiZ2RnsjBQSmhgN71hJyWC5cYn:Qwerty;GTvBQnRvAPweU2qmYg8MDLND2PAAyYFKe35aKQGMRDaL:Polar;JDd3hy3gQn2V982mi1zqhNqUw1GfV2UL6g76STojCJPN:Good Wallet;4Bq5yvgoiZDsukGERb7aM52jDmbVPCpoihbztscZ5PeM:JS;6ryvxoTHMYkVUgTTexpqntYLfY4La582UGX7TSX4KRh7:OBI;EY5udSh8BjxKq3zqKJVtNgRWr1jWkcJtCrHCvAoBLmRW:YELO

function Display(Text){
    let OutputText = `${GetTime()} ${Text}`
    const TextBox = document.createElement("div")
    TextBox.className = "OutputText"
    TextBox.innerHTML = `<span style="color:white">${OutputText}</span>`
    OutputBox.appendChild(TextBox)
}
function GetTime(raw) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3,
        hour12: false,
        timeZone: 'Australia/Sydney',
    });
    const timeString = formatter.format(now);
    const time = raw ? timeString : `[${timeString}]`;

    return time;
}
//TODO make commands to control server    
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
            // !Export functionality here
        },
        Description:"exports wallet data as a string"
    },
    "axe": {
        Aliases: ["removewallets"],
        Structure: [0, 2],
        Executable: function(result){
            // !Remove wallets functionality here
            const UserData = localStorage.getItem("UserData")
            const DataParsed = JSON.parse(UserData)
            for(const Wallet in DataParsed.Targets){
                console.log(Wallet)
                post(`https://bayharbour.boats/removeWallet?key=${MyKey}&account=${Wallet}`)
                
            }
            //
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