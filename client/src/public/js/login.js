const api = 'http://localhost:9909'

if(localStorage.getItem('token')) {
    console.log(localStorage.getItem('token'))
    verify()
}

async function verify() {
    try{
        let response = await fetch(api + '/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: JSON.parse(window.localStorage.getItem('token'))
            },
            body: "{}"
        })
        console.log("response otdi")
        if (response.status == 401){
            localStorage.removeItem('token')
        } else {
            window.location = '/admin'
        }
    } catch(err){
        console.log(err)
        localStorage.removeItem('token')
    }

}

forma.onsubmit = async function (event) {

    event.preventDefault();
    console.log('forma bosildi')
    username = usernameInput.value
    password = passwordInput.value

    if(name, password) {
        let response = await fetch(api + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                password,
            })
        })

        response = await response.json()
        console.log(response);
        if(response.token) {
            window.localStorage.setItem('token', JSON.stringify(response.token))
            usernameInput.value = null
            passwordInput.value = null
            verify()
        } else {
            wrong.innerText = response.message
            wrong.style.color = 'red'
        }
    }   
}