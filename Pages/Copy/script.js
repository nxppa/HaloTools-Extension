const PenAsset = "../../Assets/WalletCopying/Pen.png"
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
    "Valid": false //TODO make server validate whether or not the wallet account is actually an account
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
function ChangeWalletAddress(EditFrameVis, New, Data){
    const Original = EditFrameVis.Wallet.id
    EditFrameVis.id = New
    const UserData = localStorage.getItem('UserData')
    const UserDataParsed = JSON.parse(UserData)
    UserDataParsed.Targets[New] = UserDataParsed.Targets[Original]
    delete UserDataParsed.Targets[Original]
    console.log("data: ", UserDataParsed)
    localStorage.setItem("UserData", JSON.stringify(UserDataParsed))
    const Token = localStorage.getItem('session_token')
    const URL = `https://bayharbour.boats/setWalletAddress?session_token=${Token}&old=${Original}&new=${New}`
    const response = post(URL, Data)
    response.then(res => {
        return res.json()
    }).then(
        data => {
            console.log("IsValid: ", data.IsValid)
            if (data.IsValid){
                //TODO tell userdata and interface it is valid
            }
        }
    )
    return UserDataParsed
}

function SetWalletDetails(Wallet, Details){
    const UserData = localStorage.getItem('UserData')
    const UserDataParsed = JSON.parse(UserData)
    UserDataParsed.Targets[Wallet] = Details
    localStorage.setItem("UserData", JSON.stringify(UserDataParsed))
    const Token = localStorage.getItem('session_token')
    const URL = `https://bayharbour.boats/setValues?session_token=${Token}&account=${Wallet}`
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
        for (const k in EditFrameKids){
            const Frame = EditFrameKids[k]
            console.log("parsed: ", k)
            const Actual = ParamAliasToID[k]
            if (Actual){
                VariablesParsed[Actual] = Frame.Input.value
            }
        }

        const NewWallet = EditFrameKids["Wallet"].Input.value
        //TODO make checks to see if wallet inputs are valid
        const UserData = localStorage.getItem('UserData')
        const UserDataParsed = JSON.parse(UserData)        
        VariablesParsed.Halted = UserDataParsed.Targets[EditFrameVisible.Wallet.id].Halted
        const Colour = "red" //TODO either ask server to validate or validate on client 
        EditFrameVisible.WalletLabel.innerHTML = `${shorthandString(NewWallet, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
        EditFrameVisible.AliasLabel.textContent = VariablesParsed.Alias
        
        
        //EditFrameVisible = {Wallet: Wallet, WalletLabel: AddressName, AliasLabel: AliasName}

        if (EditFrameVisible.Wallet.id != NewWallet){
            ChangeWalletAddress(EditFrameVisible, NewWallet, VariablesParsed)
        } else {
            SetWalletDetails(EditFrameVisible.Wallet.id, VariablesParsed)
        }

        //TODO parse updates to local storage and server
        EditFrameVisible = false 

    })

    let LastIndexedAt = null
    let PreviousWalletDiv = null
    EditFrame.classList.toggle('hidden');
    let EditFrameVisible = false
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
            const UserData = localStorage.getItem('UserData')
            const UserDataParsed = JSON.parse(UserData)
            delete UserDataParsed.Targets[Wallet.id]
            localStorage.setItem("UserData", JSON.stringify(UserDataParsed))
            const URL = `https://bayharbour.boats/removeWallet?session_token=${Token}&account=${Wallet.id}`
            post(URL)
            Wallet.remove()
            if (EditFrameVisible && CurrentWalletDiv == LastIndexedAt) {
                EditFrame.classList.toggle('hidden');
                EditFrameVisible = false
            }
        })
        PauseStatus.addEventListener("click", () => {
            if (DataBaseData.Valid) {
                ActiveMapping[Wallet.id] = !ActiveMapping[Wallet.id]
                PauseStatus.src = ActiveMapping[Wallet.id] ? PauseAssetIcon : UnpauseAssetIcon
                //TODO make it send req to database to post new information and get if valid
                const Token = localStorage.getItem('session_token')
                const UserData = localStorage.getItem('UserData')
                const UserDataParsed = JSON.parse(UserData)
                UserDataParsed.Targets[Wallet.id].Halted = !ActiveMapping[Wallet.id]
                localStorage.setItem("UserData", JSON.stringify(UserDataParsed))
                const URL = `https://bayharbour.boats/setValue?session_token=${Token}&account=${Wallet.id}&param=Halted&value=${!ActiveMapping[Wallet.id]}`
                post(URL)
                const Colour = DataBaseData.Valid ? (ActiveMapping[Wallet.id] ? "green" : "orange") : "red"
                AddressName.innerHTML = `${shorthandString(Wallet.id, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
            }
        })
        Pen.addEventListener("click", () => {
            const InsertAt = children[getElementIndex(Wallet) + 1]
            ScrollBox.insertBefore(EditFrame, InsertAt)
            if (PreviousWalletDiv) {
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b'
            }
            if (EditFrameVisible) {
                if (CurrentWalletDiv == LastIndexedAt) {
                    EditFrame.classList.toggle('hidden');
                    EditFrameVisible = false
                    Wallet.style.boxShadow = '0 0 10px 0px #4b4b4b';
                } else {
                    Wallet.style.boxShadow = '0 0 20px #FFBD59';
                }
            } else {
                EditFrame.classList.toggle('hidden');
                EditFrameVisible = {Wallet: Wallet, WalletLabel: AddressName, AliasLabel: AliasName, OriginalAccount: Wallet.id}
                Wallet.style.boxShadow = '0 0 20px #FFBD59';

            }
            PreviousWalletDiv = Wallet
            LastIndexedAt = CurrentWalletDiv
            const UserData = localStorage.getItem('UserData')
            const UserDataParsed = JSON.parse(UserData)
            const CurrentTargets = UserDataParsed.Targets
            const CurrentTarget = CurrentTargets[Wallet.id]

            if (EditFrameVisible) {
                EditFrameKids["Wallet"].Input.value = Wallet.id
                for (const k in DataBaseData) {
                    const Alias = ParamIDToAlias[k]
                    if (Parameters[Alias]) {
                        console.log("Alias: ", Alias)
                        EditFrameKids[Alias].Input.value = CurrentTarget[k]
                    }

                }
            }
        })



        PauseStatus.src = DataBaseData.Halted ? UnpauseAssetIcon : PauseAssetIcon
        ActiveMapping[Wallet.id] = !DataBaseData.Halted
    }
    const UserData = localStorage.getItem('UserData')
    const UserDataParsed = JSON.parse(UserData)

    const Targets = UserDataParsed.Targets
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
        const UserData = localStorage.getItem('UserData')
        const UserDataParsed = JSON.parse(UserData)
        UserDataParsed.Targets[NewName] = BaseWalletTemplate
        localStorage.setItem("UserData", JSON.stringify(UserDataParsed))
        const Token = localStorage.getItem('session_token')
        const URL = `https://bayharbour.boats/newWallet?session_token=${Token}&account=${NewName}`
        post(URL, BaseWalletTemplate)

    })
    //AddWalletDiv("ivsdbi981639879egfuwbefbwe018r", null, "Next Person")

});
