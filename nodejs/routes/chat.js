const db = require('../util/database');

async function getRooms(req, res) {
    const query = await db.promise().query(`
        SELECT r.roomID, r.name, r.lastmsg as lastMsg, r.lastmsg_time as lastMsgTime
        FROM room as r
        INNER JOIN roomuser as ru
            ON r.roomID = ru.roomID
        WHERE ru.userID = '${req.data.userID}'
        ORDER BY r.lastmsg_time ASC
    `);
    res.status(200).send(query[0]);
}

// Including Messages History (sorted)
async function getRoomInfo(req, res) {
    const {roomid: roomID} = req.query;
    if (!roomID) {
        res.status(400).send({msg: 'Bad Request'});
    }

    const queryRoom = await db.promise().query(`
        SELECT roomID, name, lastmsg as lastMsg, lastmsg_time as lastMsgTime
        FROM room
        WHERE roomID = '${roomID}'
    `);
    if (queryRoom[0].length < 1) {
        res.status(401).send({msg: 'Invalid userID'});
    }

    const queryChat = await db.promise().query(`
        SELECT m.messageID, m.senderID, u.name, u.surname, u.status, m.message, m.message_type, m.sendtime
        FROM message AS m
        LEFT JOIN user AS u
            ON m.senderID = u.userID
        WHERE m.roomID = 'chatroom01'
        ORDER BY m.sendtime ASC;
    `);
    const queryMembers = await db.promise().query(`
        SELECT ru.userID, u.name, u.surname, u.status
        FROM roomuser AS ru
        LEFT JOIN user AS u
            ON ru.userID = u.userID
        WHERE ru.roomID = 'chatroom01'
        ORDER BY u.name ASC;
    `);

    res.status(200).send({
        roomID: queryRoom[0][0].roomID,
        name: queryRoom[0][0].name,
        lastMsg: queryRoom[0][0].lastMsg,
        lastMsgTime: queryRoom[0][0].lastMsgTime,
        members: queryMembers[0],
        chats: queryChat[0]
    });
}

async function invitechat(req, res) {
    const { chatroomID, newmember } = req.body;
    await db.promise().query(`INSERT INTO chatroom VALUE('${chatroomID}','${newmember}')`);
    res.status(200).send({
        msg: 'invite success'
    });
}

module.exports = { getRooms, getRoomInfo, invitechat };