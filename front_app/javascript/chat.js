const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/');
const messageHistory = document.getElementById("messageHolder")
const messageInput = document.getElementById("messageInput")
const send = document.getElementById("send")

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const messageRecieved = JSON.parse(data.message)
    const message = document.createElement('div')
    message.setAttribute('class', 'message')
    message.innerHTML = `
                        <div class="sender">${messageRecieved.username}</div>
                        <div class="timestamp">2024-01-05 16:45</div>
                        <div class="content">${messageRecieved.message}</div>
                    `
    messageHistory.appendChild(message)
    messageHistory.scrollTop = messageHistory.scrollHeight;

};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


messageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        send.click();
    }
};

send.onclick = function(e) {
    const message = messageInput.value;
    const username = Cookies.get('username')
    chatSocket.send(JSON.stringify({
        'message': message,
        'username': username
    }));
    messageInput.value = '';
};



// onopen: when the WebSocket connection is established.
// onmessage:  when a message is received from the server.
// onclose:  when the WebSocket connection is closed.
// onerror: when an error occurs.

// send(data): Sends data to the server.
// close([code[, reason]]): Closes the WebSocket connection.

// readyState: Represents the current state of the WebSocket connection.
// url: The URL that the WebSocket is connected to.