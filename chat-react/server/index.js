import express from "express";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import cors from "cors";
import path, { join } from "path";
import { fileURLToPath } from "url";

import { PORT } from "./config.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("message", (message) => {
    console.log(`Message received in the backend: ${message}`);
    socket.broadcast.emit("message", {
      body: message,
      from: socket.id.substring(2, 5),
    });
  });
});

app.use(express.static(join(__dirname, '../client/build')))


server.listen(PORT);
console.log(`Server on port ${PORT}`);
