const express = require('express')
const app = express()


//Sets the template engine ejs
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('public'))

//Routes
app.get('/', (req, res) =>{
    res.render('index')
} )

let PORT = 8000
server = app.listen(PORT)

const io = require("socket.io")(server)


//Listen for a new connection
io.on('connection', (socket) => {
        console.log('New user connected')

        socket.username = "Anonymous"

    socket.on('change_username', (data) =>{
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
