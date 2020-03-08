const express = require('express')
const app = express()


//Sets the template engine ejs
app.set('view engine', 'ejs')

//Middleware
app.use(express.static('public'))

//Simple request time logger
app.use(function(req, res, next) {
    console.log(`Middleware`)
    console.log(`req: ${req}`)
    console.log(`res: ${res}`)
    console.log(`Url: ${req.url}`);

    
    //This function call is very important. It tells that more processing is
    //required for the current request and is in the next middleware
    next();
 });

//Routes
app.get('/', (req, res) =>{
    console.log(`get "/", req: ${req}, res: ${res}`)
    res.render('index')

} )

let PORT = 1337
server = app.listen(PORT)

console.log(`Listen on port ${PORT}`)

const io = require("socket.io")(server)
const hist = []


//Listen for a new connection
io.on('connection', (socket) => {
        console.log('io event: connection')

        console.log('New user connected. Socket id: ', socket.id)


        socket.username = "Anonymous"
        send_hist(socket)
        

    socket.on('change_username', (data) => {
        console.log('io event: change_username')
        socket.username = data.username
    })


    //listen on new_message
    socket.on('new_message', (data) => {
        console.log('io event: new_message')

        hist.push({message : data.message, username : socket.username})
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username})

        
    })

    //listen on typing
    socket.on('typing', (data) => {
        console.log('io event: typing')

    	socket.broadcast.emit('typing', {username : socket.username})
    })

})

 function send_hist (socket){
    console.log('send_hist()')

     hist.forEach((element) => {
         io.to(socket.id).emit('new_message', element)
     })
 }