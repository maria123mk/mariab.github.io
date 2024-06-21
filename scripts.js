document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    requestNotificationPermission();
    checkDuePayments();
    setInterval(checkDuePayments, 60000);  // Revisa los pagos pendientes cada 60 segundos
});

document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('client-name').value;
    const paymentAmount = document.getElementById('payment-amount').value;
    const dueDate = document.getElementById('due-date').value;
    const gmailAccount = document.getElementById('gmail-account').value;
    const platform = document.getElementById('platform').value;

    const client = { name, paymentAmount, dueDate, gmailAccount, platform };
    addClientToTable(client);
    saveClientToLocalStorage(client);
    this.reset();
    checkDuePayments();
});

function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permiso para notificaciones concedido.');
            } else {
                console.log('Permiso para notificaciones denegado.');
            }
        });
    }
}

function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.forEach(client => addClientToTable(client));
}

function addClientToTable(client) {
    const table = document.getElementById('clients-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const nameCell = newRow.insertCell(0);
    const paymentAmountCell = newRow.insertCell(1);
    const dueDateCell = newRow.insertCell(2);
    const gmailAccountCell = newRow.insertCell(3);
    const platformCell = newRow.insertCell(4);
    const deleteCell = newRow.insertCell(5);

    nameCell.textContent = client.name;
    paymentAmountCell.textContent = client.paymentAmount;
    dueDateCell.textContent = client.dueDate;
    gmailAccountCell.textContent = client.gmailAccount;
    platformCell.textContent = client.platform;
    deleteCell.innerHTML = '<button onclick="deleteClient(this)">Eliminar</button>';

    highlightDueToday(newRow, client.dueDate);
}

function highlightDueToday(row, dueDate) {
    const today = new Date().toISOString().split('T')[0];
    if (dueDate <= today) {
        row.classList.add('due-today');
    }
}

function saveClientToLocalStorage(client) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
}

function deleteClient(button) {
    const row = button.parentElement.parentElement;
    const name = row.cells[0].textContent;
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const updatedClients = clients.filter(client => client.name !== name);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    row.remove();
}

function checkDuePayments() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const today = new Date().toISOString().split('T')[0];
    clients.forEach(client => {
        if (client.dueDate <= today) {
            showNotification(client.name, client.dueDate);
        }
    });
}

function showNotification(name, dueDate) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(Pago Pendiente, {
            body: ${name} tiene un pago pendiente para el día ${dueDate}.,
        });
    }
}