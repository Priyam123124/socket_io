//Old method
//Node server which will handle socket io connections
// const io = require('socket.io')(8000)
// const express = require('express');
// const app = express()
// const cors = require('cors');

// app.use(cors());


//New Method
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]

    }
})

// Apply CORS middleware to Express app
app.use(cors());

const users = {};

//io.on handles how many users connected to the application
//socket.on ek particular connection ke change ko handle karta hai. jaise agar rohan connect kiya to wo kya event fire kar rha hai wo handle karega
io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        console.log('new user joind', name)
        //agar koi chat join karta hai to uska naam users[socket.id] me store kar rhe hain
        users[socket.id] = name;
        //jisne join kiya usko chhor kar sare ko ye message aayega
        socket.broadcast.emit('user-joined', name)
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
})

server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
