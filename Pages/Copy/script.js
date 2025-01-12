const PenAsset = "../../Assets/WalletCopying/Pen.png"
const DetailsAsset = "../../Assets/WalletCopying/Details.png"
const TrashAsset = "../../Assets/WalletCopying/Trash.png"
const PauseAssetIcon = "../../Assets/WalletCopying/Pause.png"
const UnpauseAssetIcon = "../../Assets/WalletCopying/Unpause.png"

//EYWsnfIKgPo2E
let ActiveMapping = {}
let EditFrameKids = {}
const BaseWalletTemplate = {
    "PriorityFee": 0.0001,
    "MaxProportionSpending": 0.05,
    "MinimumSpending": 0.1,
    "MaxMarketCap": 0.04,
    "Halted": true,
    "Alias": "Alias",
    "Valid": false,
    "RecentTransactions":[]
}
const Parameters = {
    "Wallet": "Str",
    "Alias": "Str",
    "Max Proportion Spending": "Float",
    "Max Market Cap Percentage": "Float",
    "Minimum Spending": "Float",
    "Priority Fee": "Float",
}
const ParamIDToAlias = {
    "PriorityFee": "Priority Fee",
    "MaxProportionSpending": "Max Proportion Spending",
    "MinimumSpending": "Minimum Spending",
    "Alias": "Alias",
    "MaxMarketCap": "Max Market Cap Percentage",
};

const ParamAliasToID = {
    "Priority Fee": "PriorityFee",
    "Max Proportion Spending": "MaxProportionSpending",
    "Minimum Spending": "MinimumSpending",
    "Alias": "Alias",
    "Max Market Cap Percentage": "MaxMarketCap",
}
async function post(URL, body) {
    body = body || {};
    return await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}
function SetDictionaryItem(Item, Dictionary) {
    localStorage.setItem(Item, JSON.stringify(Dictionary))
}
function GetDictionaryItem(Item) {
    const UserData = localStorage.getItem(Item)
    const DataParsed = JSON.parse(UserData)
    return DataParsed
}
function convertEpochToDate(epochTime, isMonthFirst = true) {
    console.log("epoch time: ", epochTime)
    const date = new Date(epochTime * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    if (isMonthFirst) {
        return `${formattedMonth}/${formattedDay}`
    } else {
        return `${formattedDay}/${formattedMonth}`
    }
}
function convertEpochToLocalTimeWithPeriod(epochTime) {
    const date = new Date(epochTime * 1000)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const period = hours >= 12 ? 'PM' : 'AM';
    return {
        time: `${formattedHours}:${formattedMinutes}`,
        period: period,
    };
}


function is24HoursSince(epochTime) {
    const currentTime = Date.now()
    const elapsedTime = currentTime - epochTime * 1000
    return elapsedTime >= 24 * 60 * 60 * 1000
}

function ChangeWalletAddress(EditFrameVis, New, Data) {
    const Original = EditFrameVis.Wallet.id
    EditFrameVis.Wallet.id = New
    const UserData = GetDictionaryItem("UserData")
    UserData.Targets[New] = UserData.Targets[Original]
    delete UserData.Targets[Original]
    console.log("data: ", UserData)
    SetDictionaryItem("UserData", UserData)
    const Token = localStorage.getItem('session_token')
    const URL = `https://bayharbour.boats/setWalletAddress?session_token=${Token}&old=${Original}&new=${New}`
    const response = post(URL, Data)
    response.then(res => {
        return res.json()
    }).then(
        data => {
            console.log("IsValid: ", data.IsValid)
            let Colour = null
            if (data.IsValid) {
                const UserData = GetDictionaryItem("UserData")
                UserData.Targets[New].Valid = true
                SetDictionaryItem("UserData", UserData)
                Colour = "orange"
            } else {
                //! not valid
                const UserData = GetDictionaryItem("UserData")
                UserData.Targets[New].Valid = false
                SetDictionaryItem("UserData", UserData)
                Colour = "red"
            }
            EditFrameVis.WalletLabel.innerHTML = `${shorthandString(New, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
            UserData.Targets[New].Halted = true
            EditFrameVis.PauseIcon.src = UnpauseAssetIcon
        }
    )
    return UserData
}

function SetWalletDetails(Frame, Details) {
    const id = Frame.Wallet.id
    const UserData = GetDictionaryItem("UserData")
    UserData.Targets[id] = Details
    SetDictionaryItem("UserData", UserData)
    const Token = localStorage.getItem('session_token')
    const URL = `https://bayharbour.boats/setValues?session_token=${Token}&account=${id}`
    post(URL, Details)
}
function shorthandString(str, numDots = 3, numStartChars = 4, numEndChars = 4) {
    if (str.length <= numStartChars + numEndChars + numDots) {
        return str
    }
    const start = str.slice(0, numStartChars);
    const end = str.slice(-numEndChars);
    const dots = '.'.repeat(numDots);
    return `${start}${dots}${end}`;
}
function getElementIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element);
}
const DataMap = {
    "PriorityFee": "float",
    "MaxProportionSpending": "float",
    "MinimumSpending": "float",
    "MaxMarketCap": "float",
    "Halted": "boolean",
    "Valid": "boolean",
    "Alias": "string",
}
function convertValue(param, value) {
    console.log("pv:", param, value)
    const type = DataMap[param];
    switch (type) {
        case "float":
            return parseFloat(value);
        case "boolean":
            return value === "true" || value === true;
        case "string":
            return String(value);
        default:
            throw new Error(`Unsupported type for param: ${param}`);
    }
}
window.addEventListener('load', () => {

    document.body.classList.add('visible');
    const EditFrame = document.createElement('div');
    EditFrame.className = "EditFrame"
    const PreviousTransactionsFrame = document.createElement("div")
    PreviousTransactionsFrame.className = "PreviousTransactionsFrame"

    for (const k in Parameters) {
        const PerameterHolder = document.createElement("div")
        PerameterHolder.className = "PerameterHolder"
        PerameterHolder.id = "paramHolder" + k
        EditFrame.appendChild(PerameterHolder)

        const ParameterName = document.createElement("span")
        ParameterName.className = "ParameterName"
        ParameterName.id = "paramName" + k
        ParameterName.innerText = k
        PerameterHolder.appendChild(ParameterName)

        const ParameterInput = document.createElement("input")
        ParameterInput.type = "text"
        ParameterInput.className = "ParameterInput"
        ParameterInput.id = "paramInput" + k

        ParameterInput.spellcheck = "false"
        PerameterHolder.appendChild(ParameterInput)

        EditFrameKids[k] = { Holder: PerameterHolder, NameDiv: ParameterName, Input: ParameterInput }
    }
    const ConfirmButton = document.createElement("button")
    ConfirmButton.className = "Confirm"
    ConfirmButton.textContent = "Confirm"
    EditFrame.appendChild(ConfirmButton)
    ConfirmButton.addEventListener("click", () => {
        EditFrame.classList.toggle('hidden');
        EditFrameVisible.Wallet.style.boxShadow = '0 0 10px 0px #4b4b4b';
        let VariablesParsed = {}
        for (const k in EditFrameKids) {
            const Frame = EditFrameKids[k]
            console.log("parsed: ", k)
            const Actual = ParamAliasToID[k]
            if (Actual) {
                VariablesParsed[Actual] = Frame.Input.value
            }
        }

        const NewWallet = EditFrameKids["Wallet"].Input.value
        //TODO make checks to see if wallet inputs are valid
        const UserData = GetDictionaryItem("UserData")
        VariablesParsed.Halted = UserData.Targets[EditFrameVisible.Wallet.id].Halted
        EditFrameVisible.AliasLabel.textContent = VariablesParsed.Alias
        ActiveMapping[EditFrameVisible.Wallet.id] = false
        if (EditFrameVisible.Wallet.id != NewWallet) {
            const Colour = "grey"
            EditFrameVisible.WalletLabel.innerHTML = `${shorthandString(NewWallet, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
            ChangeWalletAddress(EditFrameVisible, NewWallet, VariablesParsed)
        } else {
            SetWalletDetails(EditFrameVisible, VariablesParsed)
        }
        EditFrameVisible = false

    })

    let LastIndexedAt = null
    let PreviousWalletDiv = null
    EditFrame.classList.toggle('hidden');
    PreviousTransactionsFrame.classList.toggle('hidden');
    let EditFrameVisible = false
    let PreviousTransactionsFrameVisible  = false
    const ScrollBox = document.getElementById("scroll-box")
    let WalletDivDex = 0
    function AddWalletDiv(WalletAddress, DataBaseData, Client) {
        WalletDivDex += 1
        const Wallet = document.createElement('div');
        const CurrentWalletDiv = WalletDivDex
        const children = ScrollBox.children;
        const secondToLast = children[children.length - 1];


        Wallet.className = 'WalletHolder';
        Wallet.id = WalletAddress;
        ScrollBox.insertBefore(Wallet, secondToLast)

        const IconsHolder = document.createElement('div');
        IconsHolder.className = "IconsHolder"
        Wallet.appendChild(IconsHolder)

        const Details = document.createElement('input');
        Details.type = "image"
        Details.src = DetailsAsset
        Details.className = "WalletIcon"
        IconsHolder.appendChild(Details)


        const Pen = document.createElement('input');
        Pen.type = "image"
        Pen.src = PenAsset
        Pen.className = "WalletIcon"
        IconsHolder.appendChild(Pen)


        const Trash = document.createElement('input');
        Trash.type = "image"
        Trash.src = TrashAsset
        Trash.className = "WalletIcon"
        IconsHolder.appendChild(Trash)

        const PauseStatus = document.createElement('input');
        PauseStatus.type = "image"
        PauseStatus.className = "WalletIcon"
        IconsHolder.appendChild(PauseStatus)

        const TransactionInfo = document.createElement('div')
        TransactionInfo.className = "TransactionInfo"
        Wallet.appendChild(TransactionInfo)


        const TimeStamp = document.createElement("span")
        TimeStamp.id = "TimeStamp"
        //TODO Make this a function to update most recent transaction
        //TODO make this check the target wallet's "Most recent transaction" element
        const epochTime = Math.floor(Date.now() - Math.random() * 1000000)
        let TimeStr = null
        if (is24HoursSince(epochTime)) {
            const TimeParsed = convertEpochToDate(epochTime, false)
            TimeStr = `${TimeParsed}`

        } else {
            const TimeParsed = convertEpochToLocalTimeWithPeriod(epochTime)
            TimeStr = `${TimeParsed.time}\u2009${TimeParsed.period}`
            //TODO make it say month/day depending on locale
        }
        TimeStamp.innerHTML = `<span>${TimeStr}</span>`
        TimeStamp.style.color = "rgba(150, 150, 150)"
        TransactionInfo.appendChild(TimeStamp)
        const LastTradeType = document.createElement("span")
        LastTradeType.id = "LTT"

        const LTT = Math.random() > 0.5 ? "BOUGHT" : "SOLD"
        const LastTransClr = LTT == "BOUGHT" ? "green" : "red"
        const CLR = LastTransClr == "green" ? 'rgba(0, 255, 0, 0.2)' : "rgba(255, 0, 0, 0.2)"
        LastTradeType.innerHTML = `<span style="color:${LastTransClr}">${LTT}</span>`
        LastTradeType.style.backgroundColor = CLR;
        LastTradeType.style.borderRadius = '4px'
        LastTradeType.style.border = `2px solid ${CLR}`;
        LastTradeType.style.padding = '4px 8px';
        if (!GetDictionaryItem("UserData").Targets[Wallet.id] || GetDictionaryItem("UserData").Targets[Wallet.id].Valid != true) {
            TransactionInfo.classList.toggle('hidden');
        }
        TransactionInfo.appendChild(LastTradeType)

        const WalletInfoHolder = document.createElement('div');
        WalletInfoHolder.className = "WalletInfoHolder"
        Wallet.appendChild(WalletInfoHolder)

        const AddressName = document.createElement("span");
        AddressName.className = "Names";
        if (!Client) {

            const Colour = DataBaseData.Valid ? (!DataBaseData.Halted ? "green" : "orange") : "red"
            AddressName.innerHTML = `${shorthandString(WalletAddress, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
        } else {
            const Colour = "red"
            AddressName.innerHTML = `${WalletAddress}\u2009<span style="color: ${Colour};">\u25C9</span>`;
        }


        WalletInfoHolder.appendChild(AddressName)
        AddressName["text-align"] = "center"

        const AliasName = document.createElement("div")
        AliasName.className = "Names"
        AliasName.textContent = DataBaseData.Alias
        WalletInfoHolder.appendChild(AliasName)
        AliasName["text-align"] = "center"
        Trash.addEventListener("click", () => {

            const Token = localStorage.getItem('session_token')
            const UserData = GetDictionaryItem("UserData")
            delete UserData.Targets[Wallet.id]
            SetDictionaryItem("UserData", UserData)
            const URL = `https://bayharbour.boats/removeWallet?session_token=${Token}&account=${Wallet.id}`
            post(URL)
            Wallet.remove()
            if (EditFrameVisible && CurrentWalletDiv == LastIndexedAt) {
                EditFrame.classList.toggle('hidden');
                EditFrameVisible = false
            }
        })
        PauseStatus.addEventListener("click", () => {
            const UserData = GetDictionaryItem("UserData")
            const WalletData = UserData.Targets[Wallet.id]
            console.log(Wallet.id, UserData)
            if (WalletData.Valid) {
                ActiveMapping[Wallet.id] = !ActiveMapping[Wallet.id]
                PauseStatus.src = ActiveMapping[Wallet.id] ? PauseAssetIcon : UnpauseAssetIcon
                const Token = localStorage.getItem('session_token')
                const UserData = GetDictionaryItem("UserData")
                UserData.Targets[Wallet.id].Halted = !ActiveMapping[Wallet.id]
                SetDictionaryItem("UserData", UserData)
                const URL = `https://bayharbour.boats/setValue?session_token=${Token}&account=${Wallet.id}&param=Halted&value=${!ActiveMapping[Wallet.id]}`
                post(URL)
                const Colour = WalletData.Valid ? (ActiveMapping[Wallet.id] ? "green" : "orange") : "red"
                AddressName.innerHTML = `${shorthandString(Wallet.id, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
            }
        })
        // Pen button logic
        Pen.addEventListener("click", () => {
            // Hide PreviousTransactionsFrame if visible
            if (PreviousTransactionsFrameVisible) {
                PreviousTransactionsFrame.classList.add('hidden');
                PreviousTransactionsFrameVisible = false;
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b';
            }

            const InsertAt = children[getElementIndex(Wallet) + 1];
            ScrollBox.insertBefore(EditFrame, InsertAt);

            if (PreviousWalletDiv) {
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b';
            }

            if (EditFrameVisible) {
                if (CurrentWalletDiv === LastIndexedAt) {
                    EditFrame.classList.toggle('hidden');
                    EditFrameVisible = false;
                    Wallet.style.boxShadow = '0 0 10px 0px #4b4b4b';
                } else {
                    Wallet.style.boxShadow = '0 0 20px #FFBD59';
                }
            } else {
                EditFrame.classList.toggle('hidden');
                EditFrameVisible = {
                    Wallet: Wallet,
                    WalletLabel: AddressName,
                    AliasLabel: AliasName,
                    OriginalAccount: Wallet.id,
                    PauseIcon: PauseStatus
                };
                Wallet.style.boxShadow = '0 0 20px #FFBD59';
            }

            PreviousWalletDiv = Wallet;
            LastIndexedAt = CurrentWalletDiv;

            const UserData = GetDictionaryItem("UserData");
            const CurrentTargets = UserData.Targets;
            const CurrentTarget = CurrentTargets[Wallet.id];

            if (EditFrameVisible) {
                EditFrameKids["Wallet"].Input.value = Wallet.id;
                for (const k in DataBaseData) {
                    const Alias = ParamIDToAlias[k];
                    if (Parameters[Alias]) {
                        console.log("Alias: ", Alias);
                        EditFrameKids[Alias].Input.value = CurrentTarget[k];
                    }
                }
            }

            PauseStatus.src = DataBaseData.Halted ? UnpauseAssetIcon : PauseAssetIcon;
            ActiveMapping[Wallet.id] = !DataBaseData.Halted;
        });

        // Details button logic
        Details.addEventListener("click", () => {
            // Hide EditFrame if visible
            if (EditFrameVisible) {
                EditFrame.classList.add('hidden');
                EditFrameVisible = false;
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b';
            }

            const InsertAt = children[getElementIndex(Wallet) + 1];
            ScrollBox.insertBefore(PreviousTransactionsFrame, InsertAt);

            if (PreviousWalletDiv) {
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b';
            }

            if (PreviousTransactionsFrameVisible) {
                if (CurrentWalletDiv === LastIndexedAt) {
                    PreviousTransactionsFrame.classList.toggle('hidden');
                    PreviousTransactionsFrameVisible = false;
                    Wallet.style.boxShadow = '0 0 10px 0px #4b4b4b';
                } else {
                    Wallet.style.boxShadow = '0 0 20px #FFBD59';
                }
            } else {
                PreviousTransactionsFrame.classList.toggle('hidden');
                PreviousTransactionsFrameVisible = {
                    Wallet: Wallet,
                    WalletLabel: AddressName,
                    AliasLabel: AliasName,
                    OriginalAccount: Wallet.id
                };
                Wallet.style.boxShadow = '0 0 20px #FFBD59';
            }

            PreviousWalletDiv = Wallet;
            LastIndexedAt = CurrentWalletDiv;

        });

        PauseStatus.src = DataBaseData.Halted ? UnpauseAssetIcon : PauseAssetIcon
        ActiveMapping[Wallet.id] = !DataBaseData.Halted
    }
    const UserData = GetDictionaryItem("UserData")

    const Targets = UserData.Targets
    for (const Wallet in Targets) {
        const Data = Targets[Wallet]
        AddWalletDiv(Wallet, Data)
    }
    console.log(Targets)
    const Plus = document.getElementById("Plus")
    Plus.addEventListener("click", () => {
        console.log(Targets)
        const length = Object.keys(Targets).length + 1
        const NewName = "Address-" + length
        Targets[NewName] = BaseWalletTemplate
        AddWalletDiv(NewName, BaseWalletTemplate, true)
        const UserData = GetDictionaryItem("UserData")
        UserData.Targets[NewName] = BaseWalletTemplate
        SetDictionaryItem("UserData", UserData)
        const Token = localStorage.getItem('session_token')
        const URL = `https://bayharbour.boats/newWallet?session_token=${Token}&account=${NewName}`
        post(URL, BaseWalletTemplate)

    })

});
