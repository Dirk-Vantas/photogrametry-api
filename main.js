const form = document.getElementById('uploadForm')

const sendFiles = async () => {
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

    const h3 = document.getElementById('msg')
    h3.textContent = `Message: ${json?.message}`

    console.log(json)
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendFiles()
})