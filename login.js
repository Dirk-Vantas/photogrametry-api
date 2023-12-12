var usertxt = document.getElementById("usr");
var pawdtxt = document.getElementById("pwd");
const form = document.getElementById('loginForm')

const submitLoginCredentials = async () => {
    const json = await getUser(usertxt.value, pawdtxt.value);
    
    if (json[0].userlevel == 1) {
        location.replace("userdashboard.html")
    }

    if (json[0].userlevel == 0) {
        location.replace("admindashboard.html")        
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