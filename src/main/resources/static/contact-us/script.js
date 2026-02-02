function sendMessage() {
    const message = document.getElementById('messageBox').value;

    if (message.trim() === '') {
        alert('Please enter a message before sending.');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/contact?message=" + encodeURIComponent(message));
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert('Message sent successfully!');
            document.getElementById('message').value = '';
        } else {
            alert('Failed to send message. Please try again later.');
        }
    }
    xhr.send();
}