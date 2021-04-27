const db = require('../database');
const { v4: uuidv4 } = require('uuid');

//getmessahehistory
async function msghis(req, res) {
  const messagehistory = await db.promise().query(`SELECT senderID,message,chatroomUser FROM chatmessage RIGHT JOIN chatroom
  ON  chatmessage.chatroomID = chatroom.chatroomID  WHERE chatroom.chatroomUser = '${req.cookies.session_id}'`);
  res.status(200).send({
    messages: messagehistory[0],
  })
};
//invitechat
async function invitechat(req, res) {
  const { chatroomID, newmember } = req.body;
  await db.promise().query(`INSERT INTO chatroom VALUE('${chatroomID}','${newmember}')`);
  res.status(200).send({
    msg: 'invite success'
  })
}
//getalllrooms
async function roomList(req, res) {
  const roomlist = await db.promise().query(`SELECT * FROM chatroom WHERE chatroomUser = '${req.cookies.session_id}'`);
}


module.exports = { msghis, invitechat,roomList };