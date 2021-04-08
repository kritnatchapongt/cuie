require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const usersRoute = require('./routes/router');
const app = express();
const db = require('./database');
const { v4: uuidv4 } = require('uuid');
const {datesql} = require('./util');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  //console.log(`${req.method} - ${req.url}`);
  next();
});
app.use('/users', usersRoute);

const http = require('http').Server(app);
const io = require('socket.io')(http);
app.get('/', function (req, res) {
  res.render('index.ejs');
});
io.sockets.on('connection', function (socket) {
  socket.on('session_id', async function (json) {
    socket.session_id = json.session_id;
    let { sessionID, chatroomID } = json;
    try {
      const name = await db.promise().query(`SELECT userID FROM cookie WHERE cookieID = '${sessionID}'`);
      io.emit("is_online", name[0][0].userID + " is join the chat...")
      socket.username = name[0][0].userID;
      const memberID = name[0][0].userID;
      if (chatroomID === "x") {
        chatroomID = uuidv4();
      }
      socket.join(chatroomID);
      console.log(chatroomID);
      const roomType = "single";
      await db.promise().query(`INSERT INTO chatroom VALUE('${chatroomID}','${memberID}','${roomType}')`);
    } catch (err) {
      io.emit("is_unauthorized", "No authentication")
      socket.disconnect('unauthorize');
    }
  });

  socket.on('disconnect', async function (username) {
    io.emit("is_online", socket.username + " is left the chat...")
    console.log(username);
    //await db.promise().query(`DELETE FROM chatroom WHERE chatroomUser = ${username}`);
    socket.disconnect('unauthorize');


  });
  socket.on('chat_message', async function (msg) {
    if (socket.username) {
      if (msg) {
        // io.emit("chat_message","<strong>" + socket.username + " </strong>:" + msg.message.value)
        const messageID = uuidv4();
        const message = msg.message.value;
        const chatroomId = msg.chatroomID;
        const time = new Date();
        const senderID = (await db.promise().query(`SELECT userID FROM cookie WHERE cookieID = '${msg.sessionID}'`))[0][0].userID;
        io.sockets.in(chatroomId).emit("chat_message", "<strong>" + socket.username + " </strong>:" + msg.message.value);
        console.log(senderID);
        await db.promise().query(`INSERT INTO chatmessage VALUE('${messageID}','${chatroomId}','${senderID}','${message}','${datesql(time)}')`);
      }
    } else { socket.disconnect('unauthorize') };

  });
});

http.listen(3000, function () {
  console.log('listening to PORT 3000')
});