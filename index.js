const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http);
const port = 8090;

app.set('view engine', 'ejs');
app.use(express.static('static_files'));

app.get("/", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.render("index");
});

//This array contains all the messages of a chat session.
let messages = [];
io.of('/').on('connect', (socket) => {

    //The server notify that someone joined the chat.
    console.log(`The client [${socket.id}] just connected to the server !`);

    //All the messages stored in the "database" are sent to the client.
    messages.forEach(message => {
        socket.emit("log", message);
    });

    //When connected, the server greets the newcomer.
    socket.emit("log", {
        id: 0,
        from: "Server", 
        content: "Welcome !!!",
        date: "a long time ago"
    });

    //When a new message comes, it is saved in the "database" and then sent
    //to every client connected at the chat. Plus, everything is logged in
    //the console server.
    socket.on('new message', (msg) => {
        msg['date'] = `${new Date().toLocaleString('en-GB')}`;
        msg['id'] = socket.id;
        console.log(`(${msg['date']})(id: ${msg['id']}) ${msg['from']} said "${msg['content']}"`);
        messages.push(msg);
        io.of('/').emit("log", msg);
    });

    socket.on('disconnect', () => {
        console.log(`The client [${socket.id}] left the chat...`);
    })
});


http.listen(port, () =>{
    console.log(`App running and listening to port ${port}`);
});