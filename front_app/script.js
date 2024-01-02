const validFieldElemnt = document.createElement('div')
const errorDiv = document.getElementsByClassName("error")[0]
const btns = document.getElementsByClassName("btns")[0]
const main_section = document.getElementById('main-section')
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
    main_section.innerHTML = `
                        <div class="channel-box">
                            <div class="channel-title">Awesome Channel</div>
                            <div class="channel-topic">Discussing amazing topics</div>
                            <button class="join-button">Join Channel</button>
                        </div>
    `
}

const setFormComponent = () =>
{
    main_section.classList.remove('home-section')
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
    let xhr = new XMLHttpRequest()
    xhr.open('POST', `http://localhost:8000/api/${viewName}/`)
    xhr.responseType = "json"
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.onreadystatechange = () => {
        console.log(`status ---------> ${xhr.status}`)
        if (xhr.readyState == 4)
        {
            if (xhr.status == 200 || xhr.status == 201)
            {
                let cookieInfo = {expires: 7, SameSite: 'Lax', path: '/'}
                Cookies.set('login_id', xhr.response.token, cookieInfo)
                Cookies.set('username', xhr.response.username, cookieInfo)
                setHomeComponent(xhr.response.username)
            }
            else
                console.log(xhr.response)
                // displayError(xhr.response.username[0])
        }
    }
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
    xhr.send(JSON.stringify(data));
}

const logoutUser = () => {
    console.log("hello")
    let xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:8000/api/logout/')
    xhr.setRequestHeader('Authorization', 'Token ' + Cookies.get('login_id'))
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4)
        {
            if (xhr.status == 202)
            {
                Cookies.remove('login_id')
                Cookies.remove('username')
                setFormComponent()
            }
        }
    }
    xhr.send(null)
}

setNabarStatus()

// keep the user logged in in the browser ✅
// change login page when user is logged in ✅
// handle errors and others status code
// impliment logout functionality ✅
// start impliment the chat logic ✅