const express = require('express');
const cookieParser = require('cookie-parser');
const usersRoute = require('./routes/router');
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((req,res,next) => {
    //console.log(`${req.method} - ${req.url}`);
    next();
});
app.use('/users',usersRoute);

app.listen(3000, () => {
    console.log('Server is running on Port 3000')
});

const socketio = require("socket.io");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("server is running...");
});

// Initialize socket for the server
const io = socketio(server);

io.on("connection", socket => {
  console.log("New user connected")});