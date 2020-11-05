let socket = io();

var chat = {
    pseudo: document.getElementById('pseudo'),
    textarea: document.getElementById('text'),
    button: document.getElementById('send')
}

chat.button.addEventListener("click", () => {
    if(chat.textarea.value !== "" && chat.pseudo.value !== ""){
        socket.emit('new message', {
            from: chat.pseudo.value,
            content: chat.textarea.value,
            date: "none"
        });
        chat.textarea.value = ""; 
    }
});

socket.on("log", (log) => {
    var span = document.createElement("span");
    span.appendChild(document.createTextNode(`[${log['from']}](${log['date']}): ${log['content']}`));
    var el = document.getElementById("logs");
    el.appendChild(span);
});