var usertxt = document.getElementById("usr");
var pawdtxt = document.getElementById("pwd");
var pawdtxt2 = document.getElementById("pwd2");
const form = document.getElementById('registerForm')

function submitLoginCredentials() {
    location.replace("login.html")
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitLoginCredentials()
})