$(function(){
    //make connection
 let socket = io.connect('http://localhost:8000')

 //buttons and inputs
 const message = $("#message")
 const username = $("#username")
 const send_message = $("#send_message")
 const send_username = $("#send_username")
 const chatroom = $("#chatroom")
 const feedback = $("#feedback")

 //Emit message
 send_message.click(function() {
     socket.emit('new_message', {message : message.val()}) 

 })

 //Listen on new_message
 socket.on("new_message", (data) => {
     feedback.html('');
     message.val('');
     chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
 })

 //Emit a username
 send_username.click(function(){
     socket.emit('change_username', {username : username.val()})
 })

 //Emit typing
 message.bind("keypress", () => {
     socket.emit('typing')
 })

 //Listen on typing
 socket.on('typing', (data) => {
     feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
 })
})

