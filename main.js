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
    return new Promise(resolve => {
      const interval = setInterval(async () => {
        try {
            
            loadProgressbar(hash)
          //const response = await makeProgressAPIcall(hash);
          //console.log('Current value:', response.value);
          let progress = loadProgressbar(hash);

            

          if (progress == 100) {
            clearInterval(interval); // Stop the interval when the desired value is found
            document.getElementById('viewer').removeAttribute("src")
            document.getElementById('viewer').removeAttribute("ios-src")
            document.getElementById('viewer').setAttribute("src", `http://dwaregateway.ddns.net/jobs/${hash}/model.glb`)
            document.getElementById('viewer').setAttribute("ios-src", `http://dwaregateway.ddns.net/jobs/${hash}/model.glb`)
            enableDownloadButton()

            bar.removeAttribute('value')
            bar.setAttribute('value', '0')

            console.log('process Done');

            resolve();
          }
        } catch (error) {
          console.error('API call failed:', error);
        }
      }, 1000); // Repeat the API call every 1 second
    });
  }

function makeProgressAPIcall(hash) {
    // Make your API call here and return a promise
    var url = 'http://dwaregateway.ddns.net:3000/status/' + hash
    return fetch(url)
      .then(response => response.json());
  }

const loadProgressbar = async (hash) => {

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
        document.getElementById('viewer').setAttribute("src", `/jobs/${hash}/model.glb`);
        document.getElementById('viewer').setAttribute("ios-src", `/jobs/${hash}/model.glb`);


        

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

    document.getElementById('download').setAttribute("src",`/jobs/${hash}/model.glb`);
    document.getElementById('download').setAttribute("href",`/jobs/${hash}/model.glb`);
    document.getElementById('BtnFile').removeAttribute('disabled')
    document.getElementById('UploadFile').className = "btn btn-primary"
}

// listener for submit
form.addEventListener('submit', (e) => {
    e.preventDefault()
    sendFiles()
})