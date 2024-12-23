const PenAsset = "../../Assets/WalletCopying/Pen.png"
const TrashAsset = "../../Assets/WalletCopying/Trash.png"
const PauseAssetIcon = "../../Assets/WalletCopying/Pause.png"
const UnpauseAssetIcon = "../../Assets/WalletCopying/Unpause.png"

let ActiveMapping = {}


const Parameters = {
    "Wallet": "Str",
    "Alias": "Str",
    "Max Proportion Spending": "Float",
    "Max Market Cap Percentage": "Float",
    "Priority Fee": "Float",
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
window.addEventListener('load', () => {

    document.body.classList.add('visible');
    const EditFrame = document.createElement('div');
    EditFrame.className = "EditFrame"

    for (const k in Parameters){
        const v = Parameters[k]
        const PerameterHolder = document.createElement("div")
        PerameterHolder.className = "PerameterHolder"
        PerameterHolder.id = "paramHolder"+k
        EditFrame.appendChild(PerameterHolder)
        
        const ParameterName = document.createElement("div")
        ParameterName.className = "PerameterName"
        ParameterName.id = "paramName"+k
        ParameterName.innerText = k
        PerameterHolder.appendChild(ParameterName)
        
    }


    let LastIndexedAt = null
    let PreviousWalletDiv = null
    EditFrame.classList.toggle('hidden');
    let EditFrameVisible = false
    const ScrollBox = document.getElementById("scroll-box")
    let WalletDivDex = 0
    function AddWalletDiv(WalletAddress, DataBaseData, TempAlias = "Alias") {
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




        Pen.addEventListener("click", () => {
            const InsertAt = children[getElementIndex(Wallet) + 1]
            ScrollBox.insertBefore(EditFrame, InsertAt)
            if (PreviousWalletDiv){
                PreviousWalletDiv.style.boxShadow = '0 0 10px 0px #4b4b4b'
            }
                console.log(LastIndexedAt, CurrentWalletDiv, EditFrameVisible)
                if (EditFrameVisible) {
                    if (CurrentWalletDiv == LastIndexedAt){
                        EditFrame.classList.toggle('hidden');
                        EditFrameVisible = false
                        Wallet.style.boxShadow = '0 0 10px 0px #4b4b4b';
                    } else {
                        Wallet.style.boxShadow = '0 0 20px #FFBD59';
                    }
                } else {
                    EditFrame.classList.toggle('hidden');
                    EditFrameVisible = true
                    Wallet.style.boxShadow = '0 0 20px #FFBD59';

                }
                PreviousWalletDiv = Wallet 
            LastIndexedAt = CurrentWalletDiv
        })



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
        
        if (DataBaseData){
            const Colour = DataBaseData.Valid ? (!DataBaseData.Halted ? "green" : "orange") : "red"
            AddressName.innerHTML = `${shorthandString(WalletAddress, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
        } else {
            const Colour = "red"
            AddressName.innerHTML = `Wallet Address\u2009<span style="color: ${Colour};">\u25C9</span>`;
        }
    

        WalletInfoHolder.appendChild(AddressName)
        AddressName["text-align"] = "center"

        const AliasName = document.createElement("div")
        AliasName.className = "Names"
        AliasName.textContent = TempAlias
        WalletInfoHolder.appendChild(AliasName)
        AliasName["text-align"] = "center"

        PauseStatus.addEventListener("click", () => {
            ActiveMapping[WalletAddress] = !ActiveMapping[WalletAddress]
            PauseStatus.src = ActiveMapping[WalletAddress] ? PauseAssetIcon : UnpauseAssetIcon
            //TODO make it send req to database to post new information and get if valid
            console.log(ActiveMapping[WalletAddress])
            const Colour = DataBaseData.Valid ? (ActiveMapping[WalletAddress] ? "green" : "orange") : "red"
            AddressName.innerHTML = `${shorthandString(WalletAddress, 3, 5, 5)}\u2009<span style="color: ${Colour};">\u25C9</span>`;
        })

        if (!DataBaseData) {
            ActiveMapping[WalletAddress] = false
            PauseStatus.src = UnpauseAssetIcon
        } else {
            //TODO
            AliasName.textContent = DataBaseData.Alias
            PauseStatus.src = DataBaseData.Halted ? UnpauseAssetIcon : PauseAssetIcon
            ActiveMapping[WalletAddress] = !DataBaseData.Halted
        }
    }
    const UserData = localStorage.getItem('UserData')
    const UserDataParsed = JSON.parse(UserData)
    console.log(UserDataParsed, UserDataParsed.Targets)
    const Targets = UserDataParsed.Targets
    for (const Wallet in Targets) {
        const Data = Targets[Wallet]
        AddWalletDiv(Wallet, Data)
    }
    const Plus = document.getElementById("Plus")
    Plus.addEventListener("click", () => {
        AddWalletDiv()
    })
    //AddWalletDiv("ivsdbi981639879egfuwbefbwe018r", null, "Next Person")

});
