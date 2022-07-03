require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors());

app.get("/assets/:file", (req, res) => {
  res.sendFile(__dirname + "/views/assets/" + req.params.file);
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/crear", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/:room", (req, res) => {
  const render = {
    roomId: req.params.room,
  };
  res.render("room", render);
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(3000);
