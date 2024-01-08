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

        

        //qrCell.appendChild(qrCodeElement);
        //row.appendChild(qrCell);

        // Add other cells
        row.innerHTML += `
            <td id="qr-${job.uniqueID}"></td>
            <td>${job.Kommentar}</td>
            <td>${formatDate(job.Date)}</td>
            <td>${job.BenutzerID}</td>
            <td>${job.Status.trim()}</td>
            <td>${job.progress}</td>
            <td><button class="btn btn-error"><i class="fa fa-trash-o" style="font-size:24px"></i></button></td>
        `;

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

// Call the function right after the page loads and then every 5 seconds
window.onload = function() {
    refreshJobData();  // Call once on page load
    setInterval(refreshJobData, 30000);  // Then call every 5 seconds
};

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
            <td><button class="btn btn-error"><i class="fa fa-trash-o" style="font-size:24px"></i></button></td>
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
    setInterval(refreshUserData, 100000);  // Then call every 5 seconds
};
