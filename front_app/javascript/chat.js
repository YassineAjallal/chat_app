const chatSocket = new WebSocket('ws://localhost:8000/ws/chat/');
const messageHistory = document.getElementById("message-history")
const messageInput = document.getElementById("message-input")
const send = document.getElementById("send")

chatSocket.onmessage = function(e) {
    console.log(e.data)
    const data = JSON.parse(e.data);
    const message = document.createElement('div')
    message.innerHTML = data.message
    message.setAttribute('class', 'other-user-message')
    messageHistory.appendChild(message)
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
    chatSocket.send(JSON.stringify({
        'message': message
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