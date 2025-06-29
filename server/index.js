const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let diagramState = []; // JSON 형식으로 메모리에 상태 저장

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 접속 시 현재 상태 전송
  socket.emit("init", diagramState);

  socket.on("update", (data) => {
    diagramState = data;
    socket.broadcast.emit("update", diagramState);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
