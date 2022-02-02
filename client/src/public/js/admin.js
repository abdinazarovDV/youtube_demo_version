const api = 'http://localhost:9909'
;(async function() {
    try{
        // console.log("admin.js dan ketdi sorov");
        let response = await fetch(api + '/admin', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            token: JSON.parse(window.localStorage.getItem('token'))  
        },
        body: "{}"
    })
        response = await response.json()
        if(response.status == 401){
            window.location = '/login'
        }
    }catch(err){
            console.log(err.message)
            window.location = '/login'
        }
        

})()

async function getData() {
    let response = await fetch(api + '/admin/videos', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            token: JSON.parse(window.localStorage.getItem('token'))
        },
        body:"{}"
    })

    response = await response.json()

    renderPost(response)
}
getData()

function renderPost(posts){
    videolist.innerHTML = null
    for(let post of posts) {
        let li = document.createElement('li')
        let video = document.createElement('video')
        let p = document.createElement('li')
        let img = document.createElement('img')
        img.setAttribute('src', 'img/delete.jpg')
        img.setAttribute('width', '25px')
        img.setAttribute('data-id', '2')
        img.className = 'delete-icon'
        img.onclick = async function(){
            let response = await fetch(api + '/admin', {
                method: 'DELETE',
                headers:{
                    'Content-Type':'application/json',
                    token: JSON.parse(localStorage.getItem('token'))
                },
                body: JSON.stringify({
                    postId: post.postId
                })
            })
            if(await response){

                getData()
            }
        }

        video.setAttribute('src', api + '/videos/content/' + post.contentAddress)
        video.setAttribute('controls', "")
        p.className = 'content'
        p.setAttribute('data-id', '2')
        p.setAttribute('contenteditable', 'true')
        p.innerText = post.contentTitle
        p.onkeyup = async event => {
            event.preventDefault()
            if(event.keyCode === 13){
                let response = await fetch(api + '/admin/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        token: JSON.parse(localStorage.getItem('token'))
                    },
                    body: JSON.stringify({
                        postId: post.postId,
                        contentTitle: p.innerText
                    })
                })
                response = await response.json()
                if(response.status!==200){
                    alert(response.message)
                } else{
                    // window.location.reload()
                    await getData()
                }
            }
        }
        li.className = 'video-item'
        li.append(video, p, img)
        videolist.append(li)
    }
}

form.onsubmit = async function(event) {
    event.preventDefault()

	let formData = new FormData()

	formData.append('video', uploadInput.files[0])
	formData.append('title', videoInput.value)

	let response = await fetch(api + '/admin/upload', {
        method: 'POST',
        headers: {token: JSON.parse(localStorage.getItem('token'))},
        body: formData
    })

    response = await response.json()
    if(response.status == 400){
        alert(response.message)
    }
    form.reset()
    if(response){
        getData()
    } else {
        window.location.reload()
    }
}