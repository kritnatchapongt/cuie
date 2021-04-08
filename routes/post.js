const db = require('../database');
const { v4: uuidv4 } = require('uuid');

//uploadpost
 async function uploadpost(req, res){
    const {head,body,targets}=JSON.parse(req.body.info);
    const targetStr = targets.toString();
    const targetsplit = targetStr.split(",");
    const postid = uuidv4();
    for(var i = 0; i < targetsplit.length; i++) {
        db.promise().query(`INSERT INTO posttarget VALUE('${postid}','${targetsplit[i]}')`);
        }  
    const picroute = req.context.picroute
    const sender =  (await db.promise().query(`SELECT userID FROM cookie WHERE cookieID = '${req.cookies.session_id}'`))[0][0].userID;
    await db.promise().query(`INSERT INTO post VALUE('${postid}','${head}','${body}','${sender}','${picroute}')`);
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        res.status(400).send({msg: "File uploaded fail"});
    }
};
//getpost
async function getpost(req,res){
    const gotpost = await db.promise().query(`SELECT post.postID,head,senderID,picroute,target FROM post RIGHT JOIN posttarget 
    ON boardcast.boardcastID = bctarget.boardcastID INNER JOIN cookie ON bctarget.target = cookie.userID
    WHERE cookie.cookieID = '${req.cookies.session_id}'`);
    res.status(200).send(gotpost);
}

module.exports = {uploadpost: uploadpost,getpost: getpost};