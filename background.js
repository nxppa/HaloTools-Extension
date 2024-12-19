

function StartFetchingValidator() {
    setInterval(async () => {
        const Token = localStorage.getItem('session_token')
        console.log(Token)
        const req = `https://bayharbour.boats/validate?token=${Token}`
        fetch(req)

    }, 500)
  }
  StartFetchingValidator()