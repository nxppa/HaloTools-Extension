
function StartFetchingValidator() {
    const AuthTimeMins = 8
    setInterval(async () => {
        const Token = localStorage.getItem('session_token')
        if (Token) {
            const req = `https://bayharbour.boats/validate?session_token=${Token}`
            const Response = await fetch(req)
            const result = await Response.json();
            if (result.success) {
                localStorage.setItem('session_token', result.token);
                document.cookie = `session_token=${result.token}; HttpOnly; Secure; Max-Age=${AuthTimeMins * 60};`
            }
        }

    }, 10000)
}
StartFetchingValidator();
const HalfSpace = "\u2009"
const PenAsset = "../../Assets/WalletCopying/Pen.png"
const DetailsAsset = "../../Assets/WalletCopying/Details.png"
const TrashAsset = "../../Assets/WalletCopying/Trash.png"
const PauseAssetIcon = "../../Assets/WalletCopying/Pause.png"
const UnpauseAssetIcon = "../../Assets/WalletCopying/Unpause.png"
const CopyIcon = "../../Assets/Actions/Copy.png"
const CheckIcon = "../../Assets/Actions/Check.png"
const SolScanIcon = "../../Assets/Sidebar/Wrap.png"
let PreviousTransactionsFrame = null
//EYWsnfIKgPo2E
let ActiveMapping = {}
let EditFrameKids = {}

let WalletToRecentTransactionElements = {}

const BaseWalletTemplate = {
    "PriorityFee": 0.0001,
    "MaxProportionSpending": 0.05,
    "MinimumSpending": 0.1,
    "MaxMarketCap": 0.04,
    "Halted": true,
    "Alias": "Alias",
    "Valid": false,
    "RecentTransactions": []
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
function SetVisible(Element, Yes = true) {
    if (Yes) {
        Element.classList.remove('hidden')
    } else {
        Element.classList.add('hidden')
    }
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
    const date = new Date(epochTime);
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
    epochTime = Math.floor(epochTime / 1000);
    const date = new Date(epochTime * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const period = hours >= 12 ? 'PM' : 'AM';
    return {
        time: `${formattedHours}:${formattedMinutes}`,
        period: period,
    };
}
function formatLargeNumber(num) {
    if (num >= 1e9) {
        return (Math.round(num / 1e8) / 10).toString() + 'B'
    } else if (num >= 1e6) {
        return (Math.round(num / 1e5) / 10).toString() + 'M'
    } else if (num >= 1e3) {
        return (Math.round(num / 1e2) / 10).toString() + 'k'
    } else {
        return Math.round(num).toString()
    }
}

function ClearAllChildren(Element) {
    while (Element.firstChild) {
        Element.removeChild(Element.firstChild);
    }
}

function is24HoursSince(epochTime) {
    const currentTime = Date.now()
    const elapsedTime = currentTime - epochTime
    return elapsedTime >= 24 * 60 * 60 * 1000
}
function isEpochTimeDayBefore(epochTime) {
    const inputDate = new Date(epochTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return (
        inputDate.getFullYear() === yesterday.getFullYear() &&
        inputDate.getMonth() === yesterday.getMonth() &&
        inputDate.getDate() === yesterday.getDate()
    );
}


function CreateRecentTransactionCard(Data) {
    const card = document.createElement('div');
    card.className = 'card';
    const HolderLeft = document.createElement("div")
    HolderLeft.className = "HolderLeft"
    const LeftTop = document.createElement("div")
    LeftTop.className = "LeftTop"
    LeftTop.addEventListener('mouseenter', () => {
        let ExtraInfoFrame = document.getElementById("ExtraInfoFrame")
        let SymbolFull = document.getElementById("SymbolFull")
        let TokenName = document.getElementById("TokenName")
        ExtraInfoFrame.style.opacity = '1'; // Fully visible
        const TokenSymbol = Data.Token.symbol
        const Name = Data.Token.name
        
        SymbolFull.innerHTML = `<span style="color:white">${TokenSymbol}</span>`
        TokenName.innerHTML = `<span style="color:white">${Name}</span>`
    });

    LeftTop.addEventListener('mouseleave', () => {
        let ExtraInfoFrame = document.getElementById("ExtraInfoFrame")
        ExtraInfoFrame.style.opacity = '0'; // Fully invisible
    });


    const LeftBottom = document.createElement("div")
    LeftBottom.className = "LeftBottom"
    let TimeStr = null
    const EpochTime = Data.Time
    if (is24HoursSince(EpochTime) || isEpochTimeDayBefore(EpochTime)) {
        const TimeParsed = convertEpochToDate(EpochTime, false)
        TimeStr = `${TimeParsed}`

    } else {
        const TimeParsed = convertEpochToLocalTimeWithPeriod(EpochTime)
        TimeStr = `${TimeParsed.time}${HalfSpace}${TimeParsed.period}`
        //TODO make it say month/day depending on locale
    }
    if (!EpochTime) {
        TransactionInfo.classList.toggle('hidden');
    }
    const TimeStamp = document.createElement("span")
    TimeStamp.id = "TimeStamp"
    TimeStamp.innerHTML = `<span>${TimeStr}</span>`
    TimeStamp.style.color = "rgba(150, 150, 150)"

    const Copy = document.createElement("input")
    Copy.type = "image"
    Copy.src = CopyIcon
    Copy.className = "CopyIcon"
    Copy.addEventListener("click", () => {
        const textToCopy = Data.mintAddress
        navigator.clipboard.writeText(textToCopy).then(() => {
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
        Copy.src = CheckIcon
        setTimeout(() => {
            Copy.src = CopyIcon
        }, 500)
    })

    const SolScan = document.createElement("input")
    SolScan.type = "image"
    SolScan.src = SolScanIcon
    SolScan.className = "CopyIcon"
    SolScan.addEventListener("click", () => {
        const textToCopy = Data.Signature
        navigator.clipboard.writeText(textToCopy).then(() => {
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
        SolScan.src = CheckIcon
        setTimeout(() => {
            SolScan.src = SolScanIcon
        }, 500)
    })



    const Picture = document.createElement("img")
    const Symbol = document.createElement("div")
    Symbol.className = "Symbol"
    const TokenSymbol = shorthandString(Data.Token.symbol, 3, 2, 2)
    const Success = Data.SuccessfullyEnacted
    let IndicColour = Success ? "green" : "red"
    if (Data.Halted) {
        IndicColour = "orange"
    }
    Symbol.innerHTML = `<span style="color:white">${TokenSymbol}</span>${HalfSpace}<span style="color:${IndicColour}">\u25C9</span>`

    Picture.className = "TokenImage"
    Picture.src = Data.Token.Image
    const MintLabel = document.createElement("div")
    let MintShorthand = shorthandString(Data.mintAddress, 3, 4, 4)
    //MintShorthand += Data.mintAddress.endsWith("pump") ? "(💊)" : "(🪙)"


    MintLabel.className = "MintLabel"
    MintLabel.innerHTML = `<span style="color:white">${MintShorthand}</span>`

    LeftBottom.appendChild(MintLabel)
    LeftBottom.appendChild(Copy)
    LeftBottom.appendChild(SolScan)
    LeftTop.appendChild(Picture)
    LeftTop.appendChild(Symbol)
    const TransType = document.createElement("div")


    const HolderType = document.createElement("div")
    HolderType.className = "HolderType"

    const LTT = Data.transactionType == "sell" ? "SOLD" : "BOUGHT"
    let AggregateParsed = null
    if (LTT == "SOLD") {
        AggregateParsed = (Data.FactorSold * 100).toFixed(1).replace(/\.0$/, "") + "%";
    } else {
        AggregateParsed = formatLargeNumber(Data.AmountTheyreBuying)
    }
    const LastTransClr = LTT == "BOUGHT" ? "green" : "red"
    Picture.style.border = `2px solid ${LastTransClr}`;

    const Aggregate = document.createElement("div")
    const TopRight = document.createElement("div")
    TopRight.className = "TopRight"
    HolderType.appendChild(TopRight)


    const BottomRight = document.createElement("div")
    BottomRight.className = "BottomRight"
    HolderType.appendChild(BottomRight)

    Aggregate.innerHTML = `<span style="color:${LastTransClr}">${AggregateParsed}</span>`
    TopRight.appendChild(TimeStamp)
    TopRight.appendChild(Aggregate)

    const CLR = LastTransClr == "green" ? 'rgba(0, 255, 0, 0.2)' : "rgba(255, 0, 0, 0.2)"
    TransType.className = "CLTT"
    TransType.innerHTML = `<span style="color:${LastTransClr}">${LTT}</span>`
    TransType.style.backgroundColor = CLR;
    TransType.style.border = `2px solid ${CLR}`;
    TransType.style.borderRadius = '4px'
    TransType.style.padding = '4px 8px';


    BottomRight.appendChild(TransType)



    card.appendChild(HolderType);

    card.appendChild(HolderLeft)
    HolderLeft.appendChild(LeftTop)
    HolderLeft.appendChild(LeftBottom)
    PreviousTransactionsFrame.appendChild(card);
}
function ChangeWalletAddress(EditFrameVis, New, Data) {
    const Original = EditFrameVis.Wallet.id
    EditFrameVis.Wallet.id = New
    const UserData = GetDictionaryItem("UserData")
    UserData.Targets[New] = UserData.Targets[Original]
    delete UserData.Targets[Original]
    console.log("data: ", UserData)
    WalletToRecentTransactionElements[New] = WalletToRecentTransactionElements[Original]
    delete WalletToRecentTransactionElements[Original]
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
            EditFrameVis.WalletLabel.innerHTML = `${shorthandString(New, 3, 5, 5)}${HalfSpace}<span style="color: ${Colour};">\u25C9</span>`;
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
    let ExtraInfoFrame = document.getElementById("ExtraInfoFrame")
    let SymbolFull = document.createElement("div")
    let TokenName = document.createElement("div")
    SymbolFull.id = "SymbolFull"
    SymbolFull.innerHTML = `<span style="color:white">token symbol</span>`
    TokenName.id = "TokenName"
    TokenName.innerHTML = `<span style="color:white">TokenName</span>`

    ExtraInfoFrame.appendChild(TokenName)
    ExtraInfoFrame.appendChild(SymbolFull)
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const offsetX = ExtraInfoFrame.offsetWidth / 2;
        const offsetY = ExtraInfoFrame.offsetHeight;
        ExtraInfoFrame.style.left = (mouseX) + 'px';
        ExtraInfoFrame.style.top = (mouseY - offsetY) + 'px';
    });


    document.body.classList.add('visible');
    const EditFrame = document.createElement('div');
    EditFrame.className = "EditFrame"
    PreviousTransactionsFrame = document.createElement("div")
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
                VariablesParsed[Actual] = convertValue(Actual, Frame.Input.value)
            }
        }

        const NewWallet = EditFrameKids["Wallet"].Input.value
        //TODO make checks to see if wallet inputs are valid
        const UserData = GetDictionaryItem("UserData")
        VariablesParsed.Halted = UserData.Targets[EditFrameVisible.Wallet.id].Halted
        VariablesParsed.RecentTransactions = UserData.Targets[EditFrameVisible.Wallet.id].RecentTransactions
        EditFrameVisible.AliasLabel.textContent = VariablesParsed.Alias
        ActiveMapping[EditFrameVisible.Wallet.id] = false
        if (EditFrameVisible.Wallet.id != NewWallet) {
            const Colour = "grey"
            EditFrameVisible.WalletLabel.innerHTML = `${shorthandString(NewWallet, 3, 5, 5)}${HalfSpace}<span style="color: ${Colour};">\u25C9</span>`;
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
    let PreviousTransactionsFrameVisible = false
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
        SetVisible(Details, false)
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
        let EpochTime = 0
        let MostRecentTransaction = DataBaseData.RecentTransactions[DataBaseData.RecentTransactions.length - 1]
        if (MostRecentTransaction) {
            EpochTime = MostRecentTransaction.Time
            SetVisible(Details)
            console.log("found most recent trans for ", WalletAddress, DataBaseData)
        } else {
        }

        let TimeStr = null
        if (is24HoursSince(EpochTime) || isEpochTimeDayBefore(EpochTime)) {
            const TimeParsed = convertEpochToDate(EpochTime, false)
            TimeStr = `${TimeParsed}`

        } else {
            const TimeParsed = convertEpochToLocalTimeWithPeriod(EpochTime)
            TimeStr = `${TimeParsed.time}${HalfSpace}${TimeParsed.period}`
            //TODO make it say month/day depending on locale
        }
        if (!EpochTime) {
            TransactionInfo.classList.toggle('hidden');
        }

        TimeStamp.innerHTML = `<span>${TimeStr}</span>`
        TimeStamp.style.color = "rgba(150, 150, 150)"
        TransactionInfo.appendChild(TimeStamp)


        const LastTradeType = document.createElement("span")
        LastTradeType.id = "LTT"

        let LTT = Math.random() > 0.5 ? "BOUGHT" : "SOLD"
        if (MostRecentTransaction) {
            LTT = MostRecentTransaction.transactionType == "sell" ? "SOLD" : "BOUGHT"
        }

        const LastTransClr = LTT == "BOUGHT" ? "green" : "red"
        const CLR = LastTransClr == "green" ? 'rgba(0, 255, 0, 0.2)' : "rgba(255, 0, 0, 0.2)"
        LastTradeType.innerHTML = `<span style="color:${LastTransClr}">${LTT}</span>`
        LastTradeType.style.backgroundColor = CLR;
        LastTradeType.style.border = `2px solid ${CLR}`;
        LastTradeType.style.borderRadius = '4px'
        LastTradeType.style.padding = '4px 8px';
        WalletToRecentTransactionElements[WalletAddress] = { DetailsIcon: Details, TransactionInfo: TransactionInfo, LastTradeType: LastTradeType, TimeStamp: TimeStamp }

        TransactionInfo.appendChild(LastTradeType)

        const WalletInfoHolder = document.createElement('div');
        WalletInfoHolder.className = "WalletInfoHolder"
        Wallet.appendChild(WalletInfoHolder)

        const AddressName = document.createElement("span");
        AddressName.className = "Names";
        if (!Client) {

            const Colour = DataBaseData.Valid ? (!DataBaseData.Halted ? "green" : "orange") : "red"
            AddressName.innerHTML = `${shorthandString(WalletAddress, 3, 5, 5)}${HalfSpace}<span style="color: ${Colour};">\u25C9</span>`;
        } else {
            const Colour = "red"
            AddressName.innerHTML = `${WalletAddress}${HalfSpace}<span style="color: ${Colour};">\u25C9</span>`;
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
                AddressName.innerHTML = `${shorthandString(Wallet.id, 3, 5, 5)}${HalfSpace}<span style="color: ${Colour};">\u25C9</span>`;
            }
        })
        Pen.addEventListener("click", () => {
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

        Details.addEventListener("click", () => {
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
            ClearAllChildren(PreviousTransactionsFrame)
            if (PreviousTransactionsFrameVisible) {
                const UserData = GetDictionaryItem("UserData")
                const TargetWallet = PreviousTransactionsFrameVisible.OriginalAccount
                const RecentTransactions = UserData.Targets[TargetWallet].RecentTransactions
                for (let i = RecentTransactions.length - 1; i >= 0; i--) {
                    const TransInfo = RecentTransactions[i];
                    CreateRecentTransactionCard(TransInfo);
                }


            }
        });

        PauseStatus.src = DataBaseData.Halted ? UnpauseAssetIcon : PauseAssetIcon
        ActiveMapping[Wallet.id] = !DataBaseData.Halted
    }
    let UserData = GetDictionaryItem("UserData")

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
    const Token = localStorage.getItem("session_token")
    const ws = new WebSocket(`wss://bayharbour.boats/ws?session_token=${Token}`)
    ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({ message: 'initial ping' }));
        HeartBeat = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ action: 'ping' }));
            }
        }, 10000)
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const type = data.type
        if (type == "Transaction") {
            const CurrentUserData = GetDictionaryItem("UserData")
            CurrentUserData.Targets[data.data.CopyingWallet].RecentTransactions.push(data.data)
            SetDictionaryItem("UserData", CurrentUserData)


            const Divs = WalletToRecentTransactionElements[data.data.CopyingWallet]
            SetVisible(Divs.TransactionInfo, true)
            const TimeStamp = Divs.TimeStamp
            const BarType = Divs.LastTradeType
            const LTT = data.data.transactionType == "sell" ? "SOLD" : "BOUGHT"
            const LastTransClr = LTT == "BOUGHT" ? "green" : "red"
            const CLR = LastTransClr == "green" ? 'rgba(0, 255, 0, 0.2)' : "rgba(255, 0, 0, 0.2)"
            BarType.innerHTML = `<span style="color:${LastTransClr}">${LTT}</span>`
            BarType.style.backgroundColor = CLR;
            BarType.style.border = `2px solid ${CLR}`;
            const EpochTime = data.data.Time
            const TimeParsed = convertEpochToLocalTimeWithPeriod(EpochTime)
            TimeStr = `${TimeParsed.time}${HalfSpace}${TimeParsed.period}`
            //TODO make it say month/day depending on locale
            if (!EpochTime) {
                TransactionInfo.classList.toggle('hidden');
            }
            TimeStamp.innerHTML = `<span>${TimeStr}</span>`
            const UserData = GetDictionaryItem("UserData")
            UserData.Targets[data.data.CopyingWallet].RecentTransactions.push(data.data)
            SetVisible(Divs.DetailsIcon)
            //TODO make this into a function instead of this fuckery
        }


        console.log('Message from server:', data);
    };
    ws.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
    };
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
});
