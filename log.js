const tbody = document.getElementById('tbody');
const tbody2 = document.getElementById('tbodylog');
const modal = document.getElementById('my_modal_1');
const head = document.getElementById('head');

const setTable = async () => {
    const logs = await getLogs();

    tbody.innerHTML = "";
    logs.forEach(function (log) {
        tbody.innerHTML += `<tr class="hover"><td>${log.ID}</td><td>${log.Logmessage}</td><td>${log.AufgabeID}</td><td>${log.Logtime}</td><td>${log.Loglevel}</td><td>${log.LogArt}</td><th><button class="btn btn-info" value="${log.ID}" onclick="infoLog(this.value)" ><i class="fa fa-info-circle" style="font-size:24px"></i></button></th></tr>`;
    });


}

const infoLog = async(id) => {
    const logs = await getLog(id);

    head.innerHTML = `Log with ID = ${id}`;
    tbody2.innerHTML = "";
    logs.forEach(function (log) {
        tbody2.innerHTML += `<tr class="hover"><td>${log.ID}</td><td>${log.Logmessage}</td><td>${log.AufgabeID}</td><td>${log.Logtime}</td><td>${log.Loglevel}</td><td>${log.LogArt}</td></tr>`;
    })
    modal.showModal();
}

const getLog = async (id) => {
    const response = await fetch(`http://localhost:3000/log?id=${id}`, {
        method: 'GET'
    })

    const json = await response.json();
    return json;
}

const getLogs = async () => {
    const response = await fetch(`http://localhost:3000/logs`, {
        method: 'GET'
    })

    const json = await response.json();
    return json;
}

setTable();