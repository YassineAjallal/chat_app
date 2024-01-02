const loginBtn = document.getElementById("login-btn")
const registerBtn = document.getElementById("register-btn")
const formHeader = document.getElementById("form-header")
const formSubmit = document.getElementById("form-submit")
const formForm = document.getElementById("form-form")
const validFieldElemnt = document.createElement('div')
const errorDiv = document.getElementsByClassName("error")[0]
const username = document.getElementById("username")
const password = document.getElementById("password")
const btns = document.getElementsByClassName("btns")[0]
const main_section = document.getElementById('main-section')
let viewName = "login"



validFieldElemnt.setAttribute('class', 'form-group')
validFieldElemnt.setAttribute('id', 'register-field')
validFieldElemnt.innerHTML = `<label for="password">Password Confirmation</label>
                                <input type="password" id="password_confirmation" name="password_confirmation" required>`

const setHomeComponent = (username) => 
{
    btns.innerHTML = `
                    <span>logged as ${username} </span>
                    <button id="register-btn">Logout</button>
                `
    main_section.innerHTML = `<h1>This is You Home Page ${username}</h1>`
}

const setNabarStatus = () =>
{
    const login_id = Cookies.get('login_id')
    const username = Cookies.get('username')
    if ( login_id != undefined && username != undefined)
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
        formForm.insertBefore(validFieldElemnt, formForm.lastElementChild)
    }
    formHeader.innerHTML = viewName
    formSubmit.innerHTML = viewName
}

const displayError = (error) => {
    errorDiv.innerHTML = error
    errorDiv.classList.add('active')
}

const sendRequest = () => {
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
        "username":username.value, 
        "password":password.value
    }
    if (viewName === "register")
    {
        const password_conf = document.getElementById("password_confirmation")
        if (password_conf.value !== data['password'])
            return displayError("passwords not identic")
    }
    xhr.send(JSON.stringify(data));
}

setNabarStatus()
loginBtn.addEventListener("click", switchView);
registerBtn.addEventListener('click', switchView)


formForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendRequest()
})



// keep the user logged in in the browser ✅
// change login page when user is logged in ✅
// handle errors and others status code
// impliment logout functionality
// start impliment the chat logic 