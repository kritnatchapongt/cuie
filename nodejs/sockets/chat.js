const {v4: uuidv4} = require('uuid');
const db = require('../util/database');
const {datesql} = require('../util/functions');

function sendChat(io, socket) {
    return async function (req) {
        // Input Validation
        const {roomID, message, messageType} = req;
        if (!roomID || !message || !messageType) {
            io.to(socket.id).emit('chat:send:response', {
                success: false,
                status: 400,
                message: "roomID, message, type are required",
                param: null
            });
            return;
        }

        // Room Validation
        const query = await db.promise().query(`
            SELECT r.roomID, r.name, r.roomtype as roomType, r.lastmsg as lastMsg, r.lastmsg_time as lastMsgTime
            FROM room as r
            INNER JOIN roomuser as ru
                ON r.roomID = ru.roomID
            WHERE r.roomID = '${roomID}' AND ru.userID = '${socket.data.userID}'
        `);
        if(query[0].length <= 0){
            io.to(socket.id).emit('chat:send:response', {
                success: false,
                status: 400,
                message: "User is not inside the specified room, or the room is not valid",
                param: null
            });
            return;
        }

        // Message Generation
        const messageID = uuidv4();
        const sendtime = datesql(new Date());
        const senderID = socket.data.userID;
        
        try {
            await db.promise().query(`
                INSERT INTO message
                (messageID, roomID, senderID, message, message_type, sendtime)
                VALUES ('${messageID}', '${roomID}', '${senderID}', '${message}', '${messageType}', '${sendtime}');
            `);
            await db.promise().query(`
                UPDATE room
                SET lastmsg = '${messageID}', lastmsg_time = '${sendtime}'
                WHERE roomID = '${roomID}';            
            `);
        } catch (err) {
            console.log(err);
            io.to(socket.id).emit('chat:send:response', {
                success: false,
                status: 500,
                message: "Internal Server Error",
                param: null
            });
            return;
        }

        io.sockets.in(roomID).emit('chat:receive', {
            messageID: messageID,
            roomID: roomID,
            senderID: senderID,
            message: message,
            messageType: messageType,
            sendtime: sendtime
        });

        io.to(socket.id).emit('chat:send:response', {
            success: true,
            status: 200,
            message: "Send chat successful",
            param: messageID
        });
    };
}

module.exports = {sendChat};