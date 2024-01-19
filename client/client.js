const io = require("socket.io-client");

const socket = io.connect("http://0.0.0.0:3000/");
console.log("hh")
socket.on("connect", () => {
  console.log("Connected to server");

  
  socket.emit("login", "1");
});

socket.on("1", (data) => {
  console.log("Received event:", data);
  
});
socket.on("Notification",(data)=>{
    console.log("Received event:", data);
})

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});