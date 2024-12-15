
const Example = {
    "account": "7SDs3PjT2mswKQ7Zo4FTcin9gJdtuW4jaacPA65BseHS",
    "balance": 942.152065674,
    "openPositions": {
        "3G85c83FBNLGFPLN6hqVSuyygHK5m7bXcZYseo2jMvKz": 7630071.373568,
        "4ap2sBgEitBGeVZkXRQnXZbBXT3BsNarL5BnzR3Fpump": 4694270.926,
        "6QiuZ51Cc6aGJCDn9H48Hpfmerjitf7KH3WLQhozpump": 16500,
        "6hkr89HYCqhJRmQ3K9PTMNDWZuhcpg6E29Y47PDspump": 56000,
        "6zU3gbmAGcRJPfPhvH7Mu8YQ3MvEq5d2SwA1BZrjpump": 41000,
        "9kLDurx3AXCv5YGUJXGxaNUNzAuuYw5xGxY4tUkiopump": 3859940.962
    },
    "type": "Wallet"
}
function IsPumpCoin(Mint) {
    return Mint.toLowerCase().endsWith("pump");
  }

//BrNoqdHUCcv9yTncnZeSjSov8kqhpmzv1nAiPbq1M95H
function ParseJSON(data) {
    const Type = data.type
    let BaseString = `Type: ${Type}\n`
    switch (Type) {
        case "Wallet":
            BaseString += `Account: ${data.account}`
            BaseString += `Balance: ${data.balance} Sol\n`
            BaseString += `Open Positions: \n`
            for (const Mint in data.openPositions){
                BaseString += `${Mint}: ${data.openPositions[Mint]}\n`
            }
        
    }
    return BaseString

}


console.log(ParseJSON(Example))