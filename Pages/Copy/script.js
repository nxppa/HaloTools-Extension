const PenAsset = "../../Assets/WalletCopying/Pen.png"
const TrashAsset = "../../Assets/WalletCopying/Trash.png"
const PauseAssetIcon = "../../Assets/WalletCopying/Pause.png"
const UnpauseAssetIcon = "../../Assets/WalletCopying/Unpause.png"

let ActiveMapping = {}
function shorthandString(str, numDots = 3, numStartChars = 4, numEndChars = 4) {
    if (str.length <= numStartChars + numEndChars + numDots) {
        return str
    }
    const start = str.slice(0, numStartChars);
    const end = str.slice(-numEndChars);
    const dots = '.'.repeat(numDots);
    return `${start}${dots}${end}`;
}

window.addEventListener('load', () => {
    document.body.classList.add('visible');

    const ScrollBox = document.getElementById("scroll-box")
    function AddWalletDiv(WalletAddress, DataBaseData){

        
        const Wallet = document.createElement('div');

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
        PauseStatus.addEventListener("click", () => {
            const Active = ActiveMapping[WalletAddress]
            PauseStatus.src = Active ? UnpauseAssetIcon : PauseAssetIcon
            ActiveMapping[WalletAddress] = !Active
        })


        const WalletInfoHolder = document.createElement('div');
        WalletInfoHolder.className = "WalletInfoHolder"
        Wallet.appendChild(WalletInfoHolder)

        const AddressName = document.createElement("div")
        AddressName.className = "Names"
        AddressName.textContent = shorthandString(WalletAddress, 3, 5, 5)
        WalletInfoHolder.appendChild(AddressName)
        AddressName["text-align"] = "center"
        
        const AliasName = document.createElement("div")
        AliasName.className = "Names"
        AliasName.textContent = "Alias"
        WalletInfoHolder.appendChild(AliasName)
        AliasName["text-align"] = "center"
        
        
        if (!DataBaseData){
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
    for (const Wallet in Targets){
        const Data = Targets[Wallet]
        AddWalletDiv(Wallet, Data)
    }

});
