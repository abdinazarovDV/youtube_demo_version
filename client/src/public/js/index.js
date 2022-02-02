const api = 'http://localhost:9909'

async function getUsers() {
    let response = await fetch(api + '/users')
    response = await response.json()
    
    await renderUsers(response)
}

async function getPosts(ID = "") {
    let response = await fetch(api + '/videos' + ID)
    response = await response.json()
    await renderPosts(response)
}

getUsers()
getPosts()

function renderUsers(users) {
    for(let user of users) {
        let [ li, a, img, span ] = elements('li', 'a', 'img', 'span')
        span.innerText = user.username
        li.className = 'channel'
        li.id = user.userId
        img.setAttribute('src', api + '/avatar/photo/' + user.avatar)
        img.setAttribute('width', '30px')
        img.setAttribute('height', '30px')
        a.append(img, span)
        li.append(a)
        navbarUsers.append(li)
        li.onclick = function () {
            getPosts('?userId=' + li.id)
        }
    }
}

function renderPosts(posts) {
    postsList.innerHTML = null
    for(let post of posts ) {
        let date = new Date(post.data)
        let [ li ] = elements('li')
        li.className = 'iframe'
        li.innerHTML = `
        <video src="${api + '/videos/content/' + post.contentAddress}" controls=""></video>
        <div class="iframe-footer">
            <img src="${api + '/avatar/photo/' +  post.avatar}" alt="channel-icon">
            <div class="iframe-footer-text">
                <h2 class="channel-name">${post.username}</h2>
                <h3 class="iframe-title">${post.contentTitle}</h3>
                <time class="uploaded-time">${date.getFullYear() + '/' + (date.getMonth()+ +1) + '/' + date.getDate() + '    |    ' + date.getHours() + ':' + date.getMinutes()}</time>
                <a class="download" href="${api+'/download/content/' + post.contentAddress}">
                    <span>${(post.quality / 1000000).toFixed(1)}MB</span>
                    <img src="./img/download.png" class='btnDownload'>
                </a>
            </div>                  
        </div>`
        
        postsList.append(li)
      
    }

}

let home = document.querySelectorAll('.home')
home.forEach( el => {
    el.onclick = () => {
        window.location.reload()
    }
})

function elements(...array) {
    return array.map( el => {
        return document.createElement(el)
    })
}

searchForm.onkeyup = event => {
    getQuery(searchInput.value)
}


// search with input text
let arraySortPosts = []
let audioCheck = false

searchForm.onsubmit = defaultSubmit


function defaultSubmit (event)  {
    // event.preventDefault()
    renderPosts(arraySortPosts)

}

async function getQuery(query) {
    let response = await fetch(api + '/videos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
            title: query
        })
    })
    response = await response.json()
    if(response) await renderOption(response)
}


function renderOption(posts) {
    arraySortPosts = posts
    datalist.innerHTML = null
    for(let post of posts){
        let [ option ] = elements('option')
        option.value = post.contentTitle
        datalist.append(option)
    }
    if(audioCheck) defaultSubmit(searchForm)
}


 //audio search
const voice = new webkitSpeechRecognition()
microphone.onclick = () => {
    voice.lang = 'uz-UZ'
    voice.start()
}

voice.onaudiostart = () => {
	console.log('Please speak!')
}

voice.onmatch = () => {
	myWord.textContent = "Pleas speak again!"
}

voice.onresult = event => {
    let result = event.results[0][0].transcript
    console.log(result)
    searchInput.value = result
    audioCheck = true
    getQuery(result)
}

plus.onclick = () => {
    window.location = '/admin'
}