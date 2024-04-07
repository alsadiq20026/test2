const { createServer } = require("http");
const port = process.env.PORT || 3000;
const app = require("./app");
const { Server } = require("socket.io");
const httpserver = new createServer(app);

const io = new Server(httpserver, {
  cors: { origin: "http://localhost:3000" },
});
io.on("connection", (socket) => {
  console.log("connected to socket ");

  socket.on("setup", (userid) => {
    socket.join(userid);
    socket.broadcast.emit("online", userid);
    console.log(userid);
  });

  socket.on("typing", (room) => {
    console.log("typing");
    console.log("room");
    socket.to(room).emit("typing", room);
  });
  socket.on("stop-typing", (room) => {
    console.log("stop-typing");
    socket.to(room).emit("stop-typing", room);
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(room + " : joined the room!");
  });
  socket.on("new message", (NewMessageReceived) => {
    var chat = NewMessageReceived.chat;
    var room = chat._id;
    var sender = NewMessageReceived.sender;
    if (!sender) {
      return console.log("sender not defined ");
    }
    var senderid = sender._id;
    console.log(senderid + " : message sender");
    const users = chat.users;
    if (!users) {
      console.log("users not defined");
    }
    socket.to(room).emit("new message", NewMessageReceived);
    socket.to(room).emit("message sent", "new message");
  });
  socket.off("setup", () => {
    console.log("user offline");
    socket.leave(userid);
  });
});

httpserver.listen(port);
