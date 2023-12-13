var usertxt = document.getElementById("usr");
var pawdtxt = document.getElementById("pwd");
var pawdtxt2 = document.getElementById("pwd2");
const form = document.getElementById('registerForm')
var msgUser = document.getElementById("alertUser");

const submitLoginCredentials = async () => {
    if (usertxt.value && pawdtxt.value && pawdtxt.value == pawdtxt2.value) {
        createUser(usertxt.value, pawdtxt.value, pawdtxt2.value);
        location.replace("login.html");
    } else {
        msgUser.innerHTML = `<div class="toast"><div class="alert alert-error"><span>Username or password not given or passwords arent identical!</span></div></div>`;
        setTimeout(function(){ msgUser.innerHTML = "" }, 4000);
    }
}

const createUser = async (usrnam, pwd, pwd2) => {
    const response = await fetch(`http://localhost:3000/users?usrnam=${usrnam}&pwd=${pwd}&pwd2=${pwd2}`, {
        method: 'POST'
    })

    const json = await response.json();
    return json;
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitLoginCredentials()
})