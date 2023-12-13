var usertxt = document.getElementById("usr");
var pawdtxt = document.getElementById("pwd");
const form = document.getElementById('loginForm');
var msgUser = document.getElementById("alertUser");

const submitLoginCredentials = async () => {
    const json = await getUser(usertxt.value, pawdtxt.value);
    if (json[0]) {
        if (json[0].userlevel == 1) {
            location.replace("userdashboard.html")
        }

        if (json[0].userlevel == 0) {
            location.replace("admindashboard.html")
        }
    } else {
        msgUser.innerHTML = `<div class="toast"><div class="alert alert-error"><span>Username or Password wrong!</span></div></div>`;
        setTimeout(function () { msgUser.innerHTML = "" }, 2000);
    }
}

const getUser = async (usrnam, pwd) => {
    const response = await fetch(`http://localhost:3000/login?nam=${usrnam}&pwd=${pwd}`, {
        method: 'GET'
    })

    const json = await response.json();
    return json;
}


form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitLoginCredentials()
})