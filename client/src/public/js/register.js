const api = 'http://localhost:9909'

if(localStorage.getItem('token')) {
    verify()
}

async function verify() {
    try{
        let response = await fetch(api + '/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: {}
        })
        if (response.status == 401){
            localStorage.removeItem('token')
        } else {
            console.log("adminga registerdan otdi")
            window.location = '/admin'
        }
    } catch(err){
        window.location = '/register'
        console.log(err)
    }

}

form.onsubmit = async function(event) {
    event.preventDefault()
    console.log("form bosildi")
	let formData = new FormData()

	formData.append('image', uploadInput.files[0])
	formData.append('username', usernameInput.value)
    formData.append('password', passwordInput.value)

	let response = await fetch(api + '/login/register', {
        method: 'POST',
        headers: {token: localStorage.getItem('token')},
        body: formData
    })

    response = await response.json()
    console.log(response)
    if(response.status == 400){
        wrong.innerText = response.message
        wrong.style.color = 'red'
    } else if(response.status == 200){
        localStorage.setItem('token', JSON.stringify(response.token))
        verify()
    }
    form.reset()
}