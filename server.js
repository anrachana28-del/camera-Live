const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.static("public"));

/* ================= USERS ================= */

let viewers = 0;

/* ================= SOCKET ================= */

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  /* CAMERA JOIN */
  socket.on("camera-join", (cameraId) => {

    socket.join(cameraId);

    console.log("Camera joined:", cameraId);

  });

  /* VIEWER JOIN */
  socket.on("viewer-join", (cameraId) => {

    socket.join(cameraId);

    viewers++;

    io.to(cameraId).emit("viewer-status", {
      online: true,
      count: viewers
    });

    console.log("Viewer joined:", cameraId);

  });

  /* WEBRTC SIGNAL */
  socket.on("signal", (data) => {

    io.to(data.cameraId).emit("signal", data);

  });

  /* DISCONNECT */
  socket.on("disconnect", () => {

    viewers--;

    if(viewers < 0){
      viewers = 0;
    }

    io.emit("viewer-status", {
      online: viewers > 0,
      count: viewers
    });

    console.log("Disconnected");

  });

});

/* ================= START ================= */

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
