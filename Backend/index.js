const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");

const { initSocket } = require("./socket"); // Import socket initializer

const authRoute = require('./route/authRoute');
const eventRoute = require('./route/eventRoute');
require('dotenv').config();

const server = http.createServer(app);
const io = initSocket(server); 


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
})

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// module.exports = { io, server, app };
// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

module.exports = (req, res) => {
  if (!res.socket.server) {
    httpServer.listen(0, () => {
      console.log(`Server is running on port ${httpServer.address().port}`);
    });
    res.socket.server = httpServer;
  }
  
  app(req, res);
};