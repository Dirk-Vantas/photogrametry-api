// Function to format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US") + ' ' + date.toLocaleTimeString("en-US");
}

// Function to populate the table with job data
function populateJobTable(data) {
    const tableBody = document.getElementById('jobTableBody');
    tableBody.innerHTML = ''; // Clear existing table data
    data.forEach(job => {
        const row = document.createElement('tr');
        row.classList.add('hover');

        // Add other cells
        row.innerHTML += `
            <td id="qr-${job.uniqueID}"></td>
            <td>${job.Kommentar}</td>
            <td>${new Date(job.Date)}</td>
            
            <td>${job.Status.trim()}</td>
            <td>${job.progress}</td>
            `;
            if  (window.location.pathname == '/admindashboard'){
                row.innerHTML += `<td>${job.BenutzerID}</td>`;
                row.innerHTML += `<td><button type="button" class="btn btn-error" onclick="deleteJob(event,'${job.uniqueID}')"><i class="fa fa-trash-o" style="font-size:24px"></i></button></td>`;
            
            }



        tableBody.appendChild(row);

        // Create a cell for the QR code
        //const qrCell = document.createElement('td');
        const qrCodeElement = document.getElementById(`qr-${job.uniqueID}`);

        // Generate the QR code
        new QRCode(qrCodeElement, {
            text: job.uniqueID,
            width: 40,
            height: 40,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });
}

// Function to refresh job data
function refreshJobData() {
    fetch('/jobs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateJobTable(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}



// Function to populate the table with user data
function populateUserTable(data) {
    const tableBody = document.getElementById('userTableBody');
    if (tableBody != null){
        tableBody.innerHTML = ''; // Clear existing table data
        data.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.ID}</td>
            <td>${user.Benutzername}</td>
            <td>${user.Passwort}</td>
            <td>${user.userlevel}</td>
            <td>
            <button type="button" class="btn btn-error" onclick="deleteUser(event,'${user.ID}')"><i class="fa fa-trash-o" style="font-size:24px"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    }

}

// Function to refresh user data
function refreshUserData() {
    fetch('/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateUserTable(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}




// Call the function right after the page loads and then every 5 seconds
window.onload = function() {
    refreshUserData();  // Call once on page load
    refreshJobData();
    refreshLogData();
    setInterval(refreshUserData, 1000);  // Then call every 5 seconds
    setInterval(refreshJobData, 1000);  // Then call every 5 seconds
    setinterval(refreshLogData, 2000);
};


function deleteJob(event, jobId) {
    event.preventDefault(); // Prevent form submission
    fetch('/delete/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if (response.ok){
            refreshJobData();  // Refresh user data after deletion
        }
    })
    .catch(error => {
        console.error('There has been a problem with your delete operation:', error);
    });
}

function deleteUser(event, userId) {
    event.preventDefault(); // Prevent form submission
    fetch('/delete/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        if (response.ok){
            refreshUserData();  // Refresh user data after deletion
        }

    })
    .catch(error => {
        console.error('There has been a problem with your delete operation:', error);
    });
}

function populateLogTable(data) {
    const tableBody = document.getElementById('logTableBody');
    if (tableBody != null) {
        tableBody.innerHTML = ''; // Clear existing table data
        data.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.ID}</td>
                <td>${log.Logmessage}</td>
                <td id="qr-${log.ID}"></td>
                <td>${log.Logtime}</td>
                <td>${log.LogLevel}</td>
                <td>${log.LogArt}</td>
            `;
            tableBody.appendChild(row);

            const qrCodeElement = document.getElementById(`qr-${log.ID}`);

            // Generate the QR code
            new QRCode(qrCodeElement, {
                text: log.AufgabeID,
                width: 40,
                height: 40,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        });
    }
}

// Function to fetch logs and refresh log data
function refreshLogData() {
    fetch('/logs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateLogTable(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
