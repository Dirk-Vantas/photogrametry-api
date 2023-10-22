const form = document.getElementById('uploadForm')
const loading = document.getElementById('loading')
const downloadButton = document.getElementById('download')
var bar = document.getElementById('progressBar')

downloadButton.className = "btn btn-primary btn-outline btn-disabled"
downloadButton.ariaDisabled = "false"

const sendFiles = async () => {

    // disable so user cannot do anything wrong
    document.getElementById('BtnFile').setAttribute('disabled', '')
    document.getElementById('UploadFile').className = "btn btn-primary btn-disabled"

    downloadButton.className = "btn btn-primary btn-outline btn-disabled"
    downloadButton.ariaDisabled = "false"

    loading.innerHTML = '<span class="loading loading-spinner loading-md"></span>'
    // Object
    const myFiles = document.getElementById('BtnFile').files

    const formData = new FormData()

    Object.keys(myFiles).forEach(key => {
        formData.append(myFiles.item(key).name, myFiles.item(key))
    })

    const response = await fetch('http://dwaregateway.ddns.net:3000/upload', {
        method: 'POST',
        body: formData
    })

    const json = await response.json()

    const h2 = document.getElementById('status')
    h2.textContent = `Uploadstate: ${json?.status}`

    loading.innerHTML = ''

    setInterval(function() {
        loadProgressbar(json?.hash);
    }, 20000);


    //    const h3 = document.getElementById('msg')
    //    h3.textContent = `Message: ${json?.message}`

    console.log(json)
}

const loadProgressbar = async (formbody) => {

    var url = 'http://dwaregateway.ddns.net:3000/status/' + formbody
    const response = await fetch(url, {
        method: 'GET'
    })

    const json = await response.json()

    console.log(json[3]);
    
    bar.removeAttribute('value')
    bar.addAttribute('value', json[3])
    
    if (json[3] == 100) {
        enableDownloadButton()
        clearInterval()
    }
}

function enableDownloadButton() {
    downloadButton.className = "btn btn-primary"
    downloadButton.ariaDisabled = true;

    document.getElementById('BtnFile').removeAttribute('disabled')
    document.getElementById('UploadFile').className = "btn btn-primary btn-disabled"
}

// listener for submit
form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendFiles()
})