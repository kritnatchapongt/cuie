const {v4: uuidv4} = require('uuid');
const db = require('../util/database');
const {datesql} = require('../util/functions');

function createSocketMapper(io) {
    return function (socket) {
        console.log('Connected' + socket.id);

        socket.on('test:to_server', async function (obj) {
            console.log(obj);
            io.emit('test:from_server', obj);
        });

        socket.on('session_id', async function (json) {
            socket.session_id = json.session_id;
            let { sessionID, chatroomID } = json;
            try {
                const name = await db.promise().query(`SELECT userID FROM cookie WHERE cookieID = '${sessionID}'`);
                io.emit("is_online", name[0][0].userID + " is join the chat...");
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
                io.emit("is_unauthorized", "No authentication");
                socket.disconnect('unauthorize');
            }
        });
    
        socket.on('disconnect', async function (username) {
            io.emit("is_online", socket.username + " is left the chat...");
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
            } else { socket.disconnect('unauthorize'); }
        });
    };
}

module.exports = {createSocketMapper};