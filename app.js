const express = require('express')
const app = express()
const mysql = require('mysql')
const fs = require('fs')
let config = require('./config.js')
let connection = mysql.createConnection(config)

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
//const hist = []

let obj = {
    hist: []
};

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

        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username})
        var msg = data

        // fs.readFile('public/logs.json', 'utf8', function readFileCallback(err, data){
        //     if (err){
        //         console.log(err);
        //     } else {
        //     obj = JSON.parse(data); //now it an object
        //     console.log(obj)

        //     obj.hist.push({message : msg.message, username : socket.username});
        //     console.log(obj) 
        //     json = JSON.stringify(obj); //convert it back to json
        //     fs.writeFile('public/logs.json', json, 'utf8', (err) =>{
        //         if (err){
        //             throw console.log(err);
                    
        //         }
        //     }); // write it back 
        // }});

           //MySQL data upload
           let config = require('./config.js');
           let connection = mysql.createConnection(config);
           // insert statment
           let stmt = `INSERT INTO logs(username,message)
                       VALUES(?,?)`;  
           let inpt = [socket.username, msg.message];
           
           // execute the insert statment
           connection.query(stmt, inpt, (err, results, fields) => {
               if (err) {
                   return console.error(err.message);
    }
           // get inserted id
           console.log('Message Id:' + results.insertId);
  });
   
           connection.end();
    })

    //listen on typing
    socket.on('typing', (data) => {
        console.log('io event: typing')

    	socket.broadcast.emit('typing', {username : socket.username})
    })

})

 function send_hist (socket){
    console.log('send_hist()')

    // fs.readFile ('public/logs.json', 'utf8', function readFileCallback(err, data){
    //     if (err){
    //         console.log(err);
    //     } else {
    //     logs = JSON.parse(data);
    //     logs.hist.forEach((element) => {
    //         io.to(socket.id).emit('new_message', element);
    //         ;})
    //     }

        
        
    // }) 

    //Sending history to a single socket from MySQL
    let config = require('./config.js');
    let connection = mysql.createConnection(config);
 
    let sql = `SELECT username, message FROM logs`;

    connection.query(sql, (error, results, fields) => {
      if (error) {
          return console.error(error.message);
  }

    //console.log(results);
    results.forEach(element => {
        io.to(socket.id).emit('new_message', element);



        
    });

});
 
connection.end();
     
}
