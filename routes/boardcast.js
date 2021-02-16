const db = require('../database');
const { v4: uuidv4 } = require('uuid');

//uploadboardcast
 async function uploadboardcast(req, res){
    const {head,body,targets}=JSON.parse(req.body.info);
    const targetStr = targets.toString();
    const targetsplit = targetStr.split(",");
    const bcid = uuidv4();
    for(var i = 0; i < targetsplit.length; i++) {
        db.promise().query(`INSERT INTO bctarget VALUE('${bcid}','${targetsplit[i]}')`);
        }  
    const picroute = req.context.picroute
    const sender =  (await db.promise().query(`SELECT userID FROM cookie WHERE cookieID = '${req.cookies.session_id}'`))[0][0].userID;
    await db.promise().query(`INSERT INTO boardcast VALUE('${bcid}','${head}','${body}','${sender}','${picroute}')`);
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        res.status(400).send({msg: "File uploaded fail"});
    }
};
//getboardcast
async function getboardcast(req,res){
    const gotboardcast = await db.promise().query(`SELECT boardcast.boardcastID,head,senderID,picroute,target FROM boardcast RIGHT JOIN bctarget 
    ON boardcast.boardcastID = bctarget.boardcastID INNER JOIN cookie ON bctarget.target = cookie.userID
    WHERE cookie.cookieID = '${req.cookies.session_id}'`);
    res.status(200).send(gotboardcast);
}

module.exports = {uploadboardcast,getboardcast};