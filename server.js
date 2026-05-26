const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

  socket.on("join-camera", (cameraId) => {
    socket.join(cameraId);
  });

  socket.on("signal", (data) => {
    io.to(data.cameraId).emit("signal", data);
  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running:", PORT);
});
