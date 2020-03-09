$(function(){
    //make connection
 let socket = io.connect('https://lab.sentirel.org', {secure: true});
 //let socket = io.connect(`http://localhost:1337`)

 console.log("connect")

 //buttons and inputs
 const message = $("#message")
 const username = $("#username")
 const send_message = $("#send_message")
 const send_username = $("#send_username")
 const chatroom = $("#chatroom")
 const feedback = $("#feedback")

 //Emit message
 send_message.click(function() {
 	console.log("click()")

     socket.emit('new_message', {message : message.val()}) 

 })

 message.bind("enterKey", (e) => {
     console.log('pressed enter')
     socket.emit('new_message', {message : message.val()})
 })

 message.keyup(function(e){
     if(e.keyCode == 13)
     {
         $(this).trigger("enterKey")
     }
 })

 //Listen on new_message
 socket.on("new_message", (data) => {

 	console.log("io event: new_message")

     feedback.html('');
     message.val('');
     chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
 })

 //Emit a username
 send_username.click(function(){

 	console.log("click()")

     socket.emit('change_username', {username : username.val()})
 })

 username.bind("enterKey", (e) => {
    console.log('pressed enter')
    socket.emit('change_username', {username : username.val()})
})

username.keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey")
    }
})



 //Emit typing
 message.bind("keypress", () => {

 	console.log("keypress()")

     socket.emit('typing')
 })

 //Listen on typing
 socket.on('typing', (data) => {

 	console.log("typing()")

     feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
 })
})

