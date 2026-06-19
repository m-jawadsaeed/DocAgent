import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./socket/socket.js";

const server = http.createServer(app);

initializeSocket(server);

server.listen(env.PORT || 4000, () => {
  console.log("Server running");
});
