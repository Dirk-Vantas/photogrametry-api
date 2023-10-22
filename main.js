const form = document.getElementById('uploadForm')

const downloadButton = document.getElementById('download')

downloadButton.className = "btn btn-primary btn-outline btn-disabled"
downloadButton.ariaDisabled = "false"

const sendFiles = async () => {

    // disable so user cannot do anything wrong
    document.getElementById('BtnFile').setAttribute('disabled', '')
    document.getElementById('UploadFile').className = "btn btn-primary btn-disabled"

    downloadButton.className = "btn btn-primary btn-outline btn-disabled"
    downloadButton.ariaDisabled = "false"
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
    h2.textContent = `Status: ${json?.status}`
    setInterval(function() {
        loadProgressbar(json?.hash);
    }, 20000);


    //    const h3 = document.getElementById('msg')
    //    h3.textContent = `Message: ${json?.message}`

    console.log(json)
}

const loadProgressbar = async (formbody) => {
    console.log(formbody)
    const response = await fetch('http://dwaregateway.ddns.net:3000/status', {
        method: 'POST',
        body: formbody
    })

    const json = await response.json()

    console.log(json);
    

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