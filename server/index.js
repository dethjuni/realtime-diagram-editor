const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const SAVE_FILE = "diagram-state.json";
let diagramState = []; // JSON 형식으로 메모리에 상태 저장

// 서버 시작 시 이전 상태 로드 (있으면)
if (fs.existsSync(SAVE_FILE)) {
  diagramState = JSON.parse(fs.readFileSync(SAVE_FILE, "utf-8"));
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 접속 시 현재 상태 전송
  socket.emit("init", diagramState);

  // 업데이트 수신
  socket.on("update", (data) => {
    diagramState = data;
    socket.broadcast.emit("update", diagramState);
    fs.writeFileSync(SAVE_FILE, JSON.stringify(diagramState));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
