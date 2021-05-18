const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const db = require('../util/database');
const { addSlash } = require('../util/functions');

// File upload for PUT Profile Pic multipart
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.PATH_STATIC, 'groups'));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now().toString() + req.context.room.roomID + path.extname(file.originalname);
        const relPath = path.join('groups', fileName);
        const absPath = path.join(process.env.PATH_STATIC, relPath);
        const urlPath = path.join('static', relPath);
        const uploadData = {
            fileName: fileName,
            fileType: file.mimetype,
            relPath: relPath,
            absPath: absPath,
            urlPath: urlPath
        };
        if (!req.context) {
            req.context = {
                upload: uploadData
            };
        } else {
            req.context.upload = uploadData;
        }
        cb(null, fileName);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const groupPicUploadMulter = multer({ storage, fileFilter });

async function validateRoom(req, res, next){
    const {roomid: roomID} = req.query;
    if (!roomID){
        res.status(400).send({msg: 'roomID is not provided'});
        return;
    }
    const query = await db.promise().query(`
        SELECT r.roomID, r.name, r.group_picpath as picpath, r.roomtype as roomType, r.lastmsg as lastMsg, r.lastmsg_time as lastMsgTime
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
        return;
    }
}

async function createRoomSingle(req, res) {
    var { targetID } = req.body;
    if (!targetID) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }

    let userID1, userID2;
    if (req.data.userID < targetID) {
        userID1 = req.data.userID;
        userID2 = targetID;
    } else {
        userID1 = targetID;
        userID2 = req.data.userID;
    }

    const query = await db.promise().query(`
        SELECT roomID
        FROM room
        WHERE roomtype = 'SINGLE' AND single_userID1 = '${userID1}' AND single_userID2 = '${userID2}'
    `);
    if (query[0].length >= 1) {
        res.status(403).send({
            msg: "User already has a 'SINGLE' type room with the targetID",
            roomID: query[0][0].roomID
        });
        return;
    }

    const roomID = uuidv4();
    try {
        await db.promise().query(`
            INSERT INTO room
            (roomID, name, single_userID1, single_userID2, roomtype)
            VALUES('${roomID}', NULL, ${userID1}, ${userID2}, 'SINGLE')
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
            msg: 'Room created successfully',
            roomID: roomID
        });
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
        return;
    }
}

async function createRoomGroup(req, res) {
    var { name, targetIDs } = req.body;
    if (!(targetIDs && Array.isArray(targetIDs) && targetIDs.every(target => typeof target === 'string'))) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }
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
        res.status(200).send({
            roomID: roomID,
            name: name,
            roomType: 'GROUP',
            members: targetIDs
        });
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
        return;
    }
}

async function getRooms(req, res) {
    const query = await db.promise().query(`
        SELECT r.roomID, r.name, r.group_picpath as picpath, r.roomtype as roomType, r.lastmsg as lastMsg,
            m.sendtime as lastMsgTime, m.message as lastMsgContext, m.message_type as lastMsgType
        FROM room as r
        INNER JOIN roomuser as ru
            ON r.roomID = ru.roomID
        LEFT JOIN message as m
            ON r.lastmsg = m.messageID
        WHERE ru.userID = '${req.data.userID}'
        ORDER BY r.lastmsg_time DESC
    `);
    
    for (var i = 0; i < query[0].length; i++) {
        const obj = query[0][i];
        const queryMembers = await db.promise().query(`
            SELECT ru.userID, u.name, u.surname, u.status, u.major, u.picpath
            FROM roomuser AS ru
            LEFT JOIN user AS u
                ON ru.userID = u.userID
            WHERE ru.roomID = '${obj.roomID}'
            ORDER BY u.name ASC;
        `);
        obj.picpath = addSlash(obj.picpath);
        obj.members = queryMembers[0].map(row => {
            row.picpath = addSlash(row.picpath);
            return row;
        });
        obj.owner = obj.members.find(x => x.userID === req.data.userID);

        if (obj.roomType === 'SINGLE' && obj.members.length === 2) {
            const other = obj.members.find(x => x.userID !== req.data.userID);
            obj.name = other.name;
            obj.picpath = other.picpath;
        }
    }

    res.status(200).send(query[0]);
    return;
}

// Including Messages History (sorted)
async function getRoomInfo(req, res) {
    const queryChat = await db.promise().query(`
        SELECT m.messageID, m.senderID, m.message, m.message_type as messageType, m.sendtime
        FROM message AS m
        WHERE m.roomID = '${req.context.room.roomID}'
        ORDER BY m.sendtime ASC;
    `);
    const queryMembers = await db.promise().query(`
        SELECT ru.userID, u.name, u.surname, u.status, u.major, u.picpath
        FROM roomuser AS ru
        LEFT JOIN user AS u
            ON ru.userID = u.userID
        WHERE ru.roomID = '${req.context.room.roomID}'
        ORDER BY u.name ASC;
    `);
    queryMembers[0] = queryMembers[0].map(row => {
        row.picpath = addSlash(row.picpath);
        return row;
    });

    let name = req.context.room.name;
    if (req.context.room.roomType === 'SINGLE' && queryMembers[0].length === 2) {
        name = queryMembers[0].find(x => x.userID !== req.data.userID).name;
    }

    res.status(200).send({
        roomID: req.context.room.roomID,
        name: name,
        picpath: addSlash(req.context.room.picpath),
        roomType: req.context.room.roomtype,
        members: queryMembers[0],
        owner: queryMembers[0].find(x => x.userID === req.data.userID),
        chats: queryChat[0]
    });
    return;
}

async function editGroupPic(req, res) {
    if (!req.context.upload) {
        res.status(500).send({msg: "File upload failed"});
        return;
    }

    const filePath = req.context.upload.relPath;
    const roomID = req.context.room.roomID;

    await db.promise().query(`
        UPDATE room
        SET group_picpath = '${filePath}'
        WHERE roomID = '${roomID}';
    `);

    res.status(200).send({msg: 'Profile picture updated successfully'});
    return;
}

async function inviteChat(req, res) {
    var { targetIDs } = req.body;
    if (req.context.room.roomType !== 'GROUP') {
        res.status(403).send({msg: 'The type of the specified room does not allow sending invitation to others'});
        return;
    }
    if (!(targetIDs && Array.isArray(targetIDs) && targetIDs.every(target => typeof target === 'string'))) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }

    const queryMembers = await db.promise().query(`
        SELECT ru.userID
        FROM roomuser AS ru
        LEFT JOIN user AS u
            ON ru.userID = u.userID
        WHERE ru.roomID = '${req.context.room.roomID}'
        ORDER BY u.name ASC;
    `);
    const dbUserIDs = queryMembers[0].map(row => {
        return row.userID;
    });
    if (targetIDs.every(val => dbUserIDs.includes(val))) {
        res.status(422).send({msg: 'All of the targetIDs are already in invited'});
        return;
    }

    try {
        for (var i = 0; i < targetIDs.length; i++) {
            await db.promise().query(`
                INSERT IGNORE INTO roomuser (roomID, userID)
                VALUES ('${req.context.room.roomID}', '${targetIDs[i]}');
            `);
        }
        res.status(200).send({msg: 'Chatroom Invited'});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: 'Internal Server Error'});
        return;
    }
}

module.exports = { groupPicUploadMulter, validateRoom, createRoomSingle, createRoomGroup, getRooms, getRoomInfo, editGroupPic, inviteChat };