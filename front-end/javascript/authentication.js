const validFieldElemnt = document.createElement('div')
const errorDiv = document.getElementsByClassName("error")[0]
const btns = document.getElementsByClassName("btns")[0]
const main_section = document.getElementById('main-section')


let chatSocket
let viewName = "login"

validFieldElemnt.setAttribute('class', 'form-group')
validFieldElemnt.setAttribute('id', 'register-field')
validFieldElemnt.innerHTML = `<label for="password">Password Confirmation</label>
<input type="password" id="password_confirmation" name="password_confirmation" required>`

const getElementId = (id) => {
    return document.getElementById(id)
}

const setHomeComponent = (username) => 
{
    btns.innerHTML = `
                    <span class="username-span">logged as ${username} </span>
                    <button id="logout-btn" onclick='logoutUser()'>Logout</button>
                `
    main_section.classList.add('home-section')
    main_section.innerHTML = ''
    fetch('http://127.0.0.1:8000/chat/rooms/')
        .then(res => res.json())
        .then(roomsData => {
            for (let i = 0; i < roomsData.length; i++)
            {
                main_section.innerHTML += `
                                    <div class="channel-box">
                                        <div class="channel-title">${roomsData[i].name}</div>
                                        <div class="channel-topic">${roomsData[i].topic}</div>
                                        <button class="join-button" onclick="joinRoom('${roomsData[i].name}')">Join Channel</button>
                                    </div>
                `
            }
        })
        .catch(err => console.log(err))
}

const setFormComponent = () =>
{
    // main_section.classList.remove('home-section')
    main_section.classList.remove('chat-container')
    btns.innerHTML = `
                    <button id="login-btn" onclick="switchView()">Login</button>
                    <button id="register-btn" onclick="switchView()">Register</button>
                  `
    
    main_section.innerHTML = `
                        <div class="form-container" id="form-container">
                            <h2 id="form-header">Login</h2>
                            <form class="form-form" method="post" id="form-form" onsubmit="authenticateUser(event)">
                                <div class="form-group">
                                    <label for="username">Username</label>
                                    <input type="text" id="username" name="username" required>
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" id="password" name="password" required>
                                </div>
                                <button type="submit" class="form-btn" id="form-submit">Login</button>
                            </form>
                        </div>
                    `
    viewName = "login"
}

const setNabarStatus = () =>
{
    const login_id = Cookies.get('login_id')
    const username = Cookies.get('username')
    if ( login_id != undefined && username != undefined )
        setHomeComponent(username)
}

const  switchView = () =>
{
    errorDiv.classList.remove('active')
    if (viewName == "register")
    {
        viewName = "login"
        document.getElementById("register-field").remove()
    }
    else
    {
        viewName = "register"
        const formForm = getElementId("form-form")
        formForm.insertBefore(validFieldElemnt, formForm.lastElementChild)
    }
    getElementId("form-header").innerHTML = viewName
    getElementId("form-submit").innerHTML = viewName
}

const displayError = (error) => {
    errorDiv.innerHTML = error
    errorDiv.classList.add('active')
}

const authenticateUser = (e) => {
    e.preventDefault()
    data = {
        "username":getElementId("username").value, 
        "password":getElementId("password").value
    }
    if (viewName === "register")
    {
        const password_conf = document.getElementById("password_confirmation")
        if (password_conf.value !== data['password'])
            return displayError("passwords not identic")
    }
    fetch(`http://localhost:8000/api/${viewName}/`, {
        method: "POST",
        body : JSON.stringify(data),
        responseType: "json",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => {
        if (res.status != 200 && res.status != 201)
            throw new String("error")
        return res.json()
    })
    .then(data => {
        
        let cookieInfo = {expires: 7, SameSite: 'Lax', path: '/'}
        Cookies.set('login_id', data.token, cookieInfo)
        Cookies.set('username', data.username, cookieInfo)
        setHomeComponent(data.username)
    })
    .catch(err => displayError(err))
}

const logoutUser = () => {
    fetch('http://localhost:8000/api/logout/', {
        method: "POST",
        headers: {
            "Authorization": 'Token ' + Cookies.get('login_id')
        }
    })
    .then(res => {
        if (res.status != 202)
            throw new String(res.body)
        return res.json()
    })
    .then(data => {
        Cookies.remove('login_id')
        Cookies.remove('username')
        setFormComponent()
    })
    .catch(err => displayError(err))
}

const renderChat = (data, roomName) =>
{
    const messageHolder = document.createElement('div')
    messageHolder.setAttribute('class', 'message-holder')
    messageHolder.setAttribute('id', 'messageHolder')
    main_section.classList.add('chat-container')
    main_section.innerHTML = `<h2 class="room_name">${roomName}</h2>`
    for (let i = 0; i < data.length; i++)
    {
        messageHolder.innerHTML += `
            <div class="message ${data[i].username != Cookies.get('username') ? 'other' : ""}">
                <div class="sender">${data[i].username}</div>
                <div class="timestamp">${data[i].created}</div>
                <div class="content">${data[i].message}</div>
            </div>
        `
    }
    main_section.appendChild(messageHolder)
    main_section.innerHTML += `
                    <div class="input-container">
                        <input type="text" id="messageInput" placeholder="Type a message...">
                        <button id="send" onclick="sendMessage()">Send</button>
                    </div>
    `

}

const joinRoom = (roomName) =>
{
    
    fetch(`http://127.0.0.1:8000/chat/rooms/${roomName}`)
    .then(res => {
        if (res.status != 200)
            throw new String('error')
        return res.json()
    })
    .then(data => renderChat(data, roomName))
    .catch(err =>  console.log(err))
    startChat(roomName)
}

const recieveMessage = (e) => {
    const data = JSON.parse(e.data);
    const messageRecieved = JSON.parse(data.message)
    const message = document.createElement('div')
    message.setAttribute('class', messageRecieved.username != Cookies.get('username') ? 'other' : "message")
    // message_owner = messageRecieved.username != Cookies.get('username') ? 'other' : ""
    // message.classList.add(message_owner)
    message.innerHTML = `
                        <div class="sender">${messageRecieved.username}</div>
                        <div class="timestamp">${messageRecieved.created}</div>
                        <div class="content">${messageRecieved.message}</div>
                    `
    document.getElementById("messageHolder").appendChild(message)
    document.getElementById("messageHolder").scrollTop = document.getElementById("messageHolder").scrollHeight;
}

const closeSocket = (e) => {
    console.log('Chat socket closed unexpectedly');
}


const  sendMessage = (e) => {
    const message = document.getElementById("messageInput").value;
    const username = Cookies.get('username')
    chatSocket.send(JSON.stringify({
        'message': message,
        'username': username
    }));
    document.getElementById("messageInput").value = '';
}


const startChat = (roomName) =>
{
    chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}`)
    chatSocket.onmessage = recieveMessage
    chatSocket.onclose = closeSocket
}

setNabarStatus()
// keep the user logged in in the browser ✅
// change login page when user is logged in ✅
// impliment logout functionality ✅
// start impliment the chat logic ✅
// replace the css file ✅

// handle errors and others status code
// fix the login toggle button







/* --------- Doc ---------- */

// onopen: when the WebSocket connection is established.
// onmessage:  when a message is received from the server.
// onclose:  when the WebSocket connection is closed.
// onerror: when an error occurs.

// send(data): Sends data to the server.
// close([code[, reason]]): Closes the WebSocket connection.

// readyState: Represents the current state of the WebSocket connection.
// url: The URL that the WebSocket is connected to.