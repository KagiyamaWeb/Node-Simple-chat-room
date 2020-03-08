const express = require('express')
const app = express()


//Sets the template engine ejs
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('public'))

//Simple request time logger
app.use(function(req, res, next) {
    console.log("Middleware " + Date.now())
    console.log(req.url);
    
    //This function call is very important. It tells that more processing is
    //required for the current request and is in the next middleware
    next();
 });

//Routes
app.get('/', (req, res) =>{
    res.render('index')

} )

let PORT = 1337
server = app.listen(PORT)

const io = require("socket.io")(server)
const hist = []


//Listen for a new connection
io.on('connection', (socket) => {
        console.log('New user connected. Socket id: ', socket.id)


        socket.username = "Anonymous"
        send_hist(socket)
        

    socket.on('change_username', (data) => {
        socket.username = data.username
    })


    //listen on new_message
    socket.on('new_message', (data) => {
        hist.push({message : data.message, username : socket.username})
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username})

        
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })

})

 function send_hist (socket){
     hist.forEach((element) => {
         io.to(socket.id).emit('new_message', element)
     })
 }