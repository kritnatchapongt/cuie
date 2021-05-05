const { v4: uuidv4 } = require('uuid');
const db = require('../util/database');

async function validateRoom(req, res, next){
    const {roomid: roomID} = req.query;
    if (!roomID){
        res.status(400).send({msg: 'roomID is not provided'});
    }
    const query = await db.promise().query(`
        SELECT r.roomID, r.name, r.roomtype as roomType, r.lastmsg as lastMsg, r.lastmsg_time as lastMsgTime
        FROM room as r
        INNER JOIN roomuser as ru
            ON r.roomID = ru.roomID
        WHERE r.roomID = '${roomID}' AND ru.userID = '${req.data.userID}'
    `);
    if(query[0].length > 0){
        const room = query[0][0];
        if (!req.context) {
            req.context = {
                room: room
            };
        } else {
            req.context.room = room;
        }
        next();
    } else {
        res.status(403).send({msg: 'User is not inside the specified room, or the room is not valid'});
    }
}

async function createRoom(req, res) {
    var { roomType } = req.body;
    if (roomType === 'SINGLE') {
        createRoomSingle(req, res);
    } else if (roomType === 'GROUP') {
        createRoomGroup(req, res);
    } else {
        res.status(400).send({msg: 'Unknown RoomType'});
    }
}

async function createRoomSingle(req, res) {
    var { targetID } = req.body;
    if (!targetID) {
        res.status(400).send({msg: 'Bad Request'});
    }

    const roomID = uuidv4();
    try {
        await db.promise().query(`
            INSERT INTO room
            (roomID, name, roomtype)
            VALUES('${roomID}', NULL, 'SINGLE')
        `);
        await db.promise().query(`
            INSERT IGNORE INTO roomuser (roomID, userID)
            VALUES ('${roomID}', '${req.data.userID}');
        `);
        await db.promise().query(`
            INSERT IGNORE INTO roomuser (roomID, userID)
            VALUES ('${roomID}', '${targetID}');
        `);
        res.status(200).send({
            roomID: roomID,
            name: null,
            roomType: 'SINGLE',
            members: [req.data.userID, targetID]
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
    }
}

async function createRoomGroup(req, res) {
    var { name, targetIDs } = req.body;
    if (!(targetIDs & Array.isArray(targetIDs))) {
        res.status(400).send({msg: 'Bad Request'});
    }
    targetIDs = targetIDs.toString().split(",");
    if (!targetIDs.includes(req.data.userID)) {
        targetIDs.push(req.data.userID);
    }
    name = (name) ? name : targetIDs.toString();
    const roomID = uuidv4();

    try {
        await db.promise().query(`
            INSERT INTO room
            (roomID, name, roomtype)
            VALUES('${roomID}', '${name}', 'GROUP');
        `);
        for (var i = 0; i < targetIDs.length; i++) {
            await db.promise().query(`
                INSERT IGNORE INTO roomuser (roomID, userID)
                VALUES ('${roomID}', '${targetIDs[i]}');
            `);
        }
        console.log({
            roomID: roomID,
            name: name,
            roomType: 'GROUP',
            members: targetIDs
        });
        res.status(200).send({
            roomID: roomID,
            name: name,
            roomType: 'GROUP',
            members: targetIDs
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
    }
}

async function getRooms(req, res) {
    const query = await db.promise().query(`
        SELECT r.roomID, r.name, r.roomtype, r.lastmsg as lastMsg,
            m.sendtime as lastMsgTime, m.message as lastMsgContext, m.message_type as lastMsgType
        FROM room as r
        INNER JOIN roomuser as ru
            ON r.roomID = ru.roomID
        LEFT JOIN message as m
            ON r.lastmsg = m.messageID
        WHERE ru.userID = '${req.data.userID}'
        ORDER BY r.lastmsg_time ASC
    `);
    
    for (var i = 0; i < query[0].length; i++) {
        const obj = query[0][i];
        const queryMembers = await db.promise().query(`
            SELECT ru.userID
            FROM roomuser AS ru
            LEFT JOIN user AS u
                ON ru.userID = u.userID
            WHERE ru.roomID = '${obj.roomID}'
            ORDER BY u.name ASC;
        `);
        obj.members = queryMembers[0].map(row => row.userID);
    }
    res.status(200).send(query[0]);
}

// Including Messages History (sorted)
async function getRoomInfo(req, res) {
    const queryChat = await db.promise().query(`
        SELECT m.messageID, m.senderID, u.name, u.surname, u.status, m.message, m.message_type, m.sendtime
        FROM message AS m
        LEFT JOIN user AS u
            ON m.senderID = u.userID
        WHERE m.roomID = '${req.context.room.roomID}'
        ORDER BY m.sendtime ASC;
    `);
    const queryMembers = await db.promise().query(`
        SELECT ru.userID, u.name, u.surname, u.status
        FROM roomuser AS ru
        LEFT JOIN user AS u
            ON ru.userID = u.userID
        WHERE ru.roomID = '${req.context.room.roomID}'
        ORDER BY u.name ASC;
    `);

    res.status(200).send({
        roomID: req.context.room.roomID,
        name: req.context.room.name,
        roomType: req.context.room.roomtype,
        lastMsg: req.context.room.lastMsg,
        lastMsgTime: req.context.room.lastMsgTime,
        members: queryMembers[0],
        chats: queryChat[0]
    });
}

async function inviteChat(req, res) {
    var { targetIDs } = req.body;
    if (req.context.room.roomType !== 'GROUP') {
        res.status(403).send({msg: 'The type of the specified room does not allow sending invitation to others'});
    }
    if (!(targetIDs & Array.isArray(targetIDs))) {
        res.status(400).send({msg: 'Bad Request'});
    }
    targetIDs = targetIDs.toString().split(",");

    try {
        for (var i = 0; i < targetIDs.length; i++) {
            await db.promise().query(`
                INSERT IGNORE INTO roomuser (roomID, userID)
                VALUES ('${req.context.room.roomID}', '${targetIDs[i]}');
            `);
        }
        res.status(200).send({msg: 'Chatroom Invited'});
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
    }
}

module.exports = { validateRoom, createRoom, getRooms, getRoomInfo, inviteChat };