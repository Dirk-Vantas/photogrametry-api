const tbody = document.getElementById('tbody');



const setTable = async () => {
    const users = await getUsers();

    tbody.innerHTML = "";
    users.forEach(function(user) {
        tbody.innerHTML += `<tr class="hover"><td>${user.ID}</td><td>${user.Benutzername}</td><td>${user.Passwort}</td><td>${user.userlevel}</td><th><button class="btn btn-error" value="${user.ID}" onclick="delUser(this.value)" ><i class="fa fa-trash-o" style="font-size:24px"></i></button></th></tr>`;
    });
}

const getUsers = async () => {
    const response = await fetch(`http://localhost:3000/users`, {
        method: 'GET'
    })

    const json = await response.json();
    return json;
}

const delUser = async (id) => {
    const response = await fetch(`http://localhost:3000/users?id=${id}`, {
        method: 'DELETE'
    });

    const json = await response.json();
    setTable();
}

setTable();