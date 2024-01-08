const form = document.getElementById('uploadForm')
const loading = document.getElementById('loading')
const downloadButton = document.getElementById('download')
var bar = document.getElementById('progressBar')

//downloadButton.className = "btn btn-primary btn-outline btn-disabled"
//downloadButton.ariaDisabled = "false"

const sendFiles = async () => {

    console.log('button test')
    // disable so user cannot do anything wrong
    document.getElementById('BtnFile').setAttribute('disabled', '')
    document.getElementById('UploadFile').className = "btn btn-primary btn-disabled"

    //downloadButton.className = "btn btn-primary btn-outline btn-disabled"
    //downloadButton.ariaDisabled = "false"

    //loading.innerHTML = '<span class="loading loading-spinner loading-md"></span>'
    // Object
    const myFiles = document.getElementById('BtnFile').files

    const formData = new FormData()

    Object.keys(myFiles).forEach(key => {
        formData.append(myFiles.item(key).name, myFiles.item(key))
    })

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    })

    const json = await response.json()

    const h2 = document.getElementById('status')
    h2.textContent = `Uploadstate: ${json?.status}`

    loading.innerHTML = ''

    // const intervalId = setInterval(function() {
    //     loadProgressbar(json?.hash);
    // }, 5000);

    waitForProcess(json?.hash);

    //    const h3 = document.getElementById('msg')
    //    h3.textContent = `Message: ${json?.message}`

    console.log(json)
}

async function waitForProcess(hash) {
    const done = 100;
    let status = false;
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        try {
            
            let progress = await loadProgressbar(hash,status);
            if (progress === done){
                clearInterval(interval); // Stop the interval when the desired value is found
                
                bar.removeAttribute('value')
                bar.setAttribute('value', '0')
                console.log('DONEDONEDONEDONEDONEDONEDONEDONEDONEDONEDONE')
                resolve();
            }
            else{
                console.log('keep running');
            }
            
        } catch (error) {
          console.error('API call failed:', error);
        }
      }, 3000); // Repeat the API call every 3 second
    });
  }

const loadProgressbar = async (hash,status) => {

    var url = 'http://dwaregateway.ddns.net:3000/status/' + hash
    const response = await fetch(url, {
        method: 'GET'
    })

    const json = await response.json()

    console.log(json[3]);

    bar.removeAttribute('value')
    bar.setAttribute('value', json[3])

    if (json[3] == 100){
        console.log('done');

        
        //document.getElementById('viewer').removeAttribute("src");
        enableDownloadButton(hash);
        
        //document.getElementById('viewer').removeAttribute("ios-src")

        //need this to reload
        document.getElementById('viewer').setAttribute("src", `http://dwaregateway.ddns.net/jobs/${hash}/model.glb`);
        document.getElementById('viewer').setAttribute("ios-src", `http://dwaregateway.ddns.net/jobs/${hash}/model.glb`);

        let container = document.getElementById("viewer");
        let content = container.innerHTML;
        container.innerHTML= content; 

        

        bar.removeAttribute('value');
        bar.setAttribute('value', '0');
    }

    return json[3];
    
    // bar.removeAttribute('value')
    // bar.setAttribute('value', json[3])
    
    // if (json[3] == 100) {
    //     //set new shit
        
    //     clearInterval(intervalId);
    // }
}

function enableDownloadButton(hash) {
    downloadButton.className = "btn btn-primary"
    downloadButton.ariaDisabled = true;

    document.getElementById('download').setAttribute("src",`http://dwaregateway.ddns.net/jobs/${hash}/model.glb`);
    document.getElementById('download').setAttribute("href",`http://dwaregateway.ddns.net/jobs/${hash}/model.glb`);
    document.getElementById('BtnFile').removeAttribute('disabled')
    document.getElementById('UploadFile').className = "btn btn-primary"
}

// listener for submit
form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendFiles()
})