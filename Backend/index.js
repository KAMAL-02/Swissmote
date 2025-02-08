const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./route/authRoute');
const eventRoute = require('./route/eventRoute');
require('dotenv').config();

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});