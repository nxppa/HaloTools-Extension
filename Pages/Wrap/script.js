let IsWrapping = true
const WrapAsset = "../../Assets/Wrapping/Wrap.png"
const UnwrapAsset = "../../Assets/Wrapping/Unwrap.png"
const WrapMessage = "Amount to wrap"
const UnwrapMessage = "Amount to unwrap"
const OutputWrapMessage = "Wrapped SOL"
const OutputUnwrapMessage = "Unwrapped SOL"

const Input = document.getElementById("inp")
const Output = document.getElementById("outp")
window.addEventListener('load', () => {
    document.body.classList.add('visible');
    const WrapImg = document.getElementById("WrapImg") 
    WrapImg.addEventListener("click", () => {
        IsWrapping = IsWrapping ? false : true
        WrapImg.src = IsWrapping ? WrapAsset : UnwrapAsset
        Input.placeholder = IsWrapping ? WrapMessage : UnwrapMessage
        Output.placeholder = IsWrapping ? OutputWrapMessage : OutputUnwrapMessage
    })

});
