const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { genratemessage, genrateLocationMessage } = require("./utiles/messages");
const {
  adduser,
  removeuser,
  getUser,
  getUsersInRoom,
} = require("./utiles/user");
const multer = require("multer");
const Public_dir = path.join(__dirname, "../public");
const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(express.static(Public_dir));
app.use(express.json());

// -------------------------------------------------------------------------------------------------------
const upload = multer({
  dest: path.join(__dirname, "../public/upload"),
  limits: {
    fileSize: 5000000,
  },
});

app.post("/avatar", upload.single("files"), (req, res) => {
  console.log("file -> ", req.file);
  if (!req.file) {
    console.log("No file received");
    return res.send({ success: false });
  }
  console.log("file received");
  res.send({ success: true });
});

// -------------------------------------------------------------------------------------------------------

io.on("connection", (socket) => {
  console.log("new web socket connection ");

  socket.on("avatar", (data) => {
    console.log("avatar");
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "send-image",
        genratemessage({ username: user.username, msg: data })
      );
      socket.emit("personal-ui");
    }
  });

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = adduser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit(
      "message",
      genratemessage({ username: "Admin", msg: "Welcome." })
    ); //this will send massage to perticular user
    socket.broadcast.to(user.room).emit(
      "message",
      genratemessage({
        username: "Admin",
        msg: `${user.username} has joined !`,
      })
    ); //this will send massage to all users expect currunt user
    socket.emit("personal-ui");
    io.to(user.room).emit("room", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("send", (msg, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "message",
      genratemessage({ username: user.username, msg: msg })
    ); //this will send massage to all users
    socket.emit("personal-ui");
    callback();
  });

  socket.on("location", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "location-message",
      genrateLocationMessage({
        username: user.username,
        url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
      })
    );
    socket.emit("personal-ui");
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeuser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        genratemessage({
          username: "Admin",
          msg: `${user.username} has left !`,
        })
      );
      io.to(user.room).emit("room", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      socket.emit("personal-ui");
    }
  });
});

server.listen(3000, () => {
  console.log("listning to port 3000 ..");
});
