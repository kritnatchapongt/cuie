const db = require('../database');
const { v4: uuidv4 } = require('uuid');



async function validateCookie(req,res,next){
    const {cookies} =req;
    if ('session_id' in cookies){
        const a = await db.promise().query(`SELECT * FROM cookie WHERE cookieID = '${cookies.session_id}'`);
        if(a[0].length > 0){
            next();
        } else {
            res.status(403).send({msg:'Not Authenticated'});
        }
    }
    else { res.status(403).send({msg:'Not Authenticated'});}
};

//signup
async function signup(req, res) {
    const {name,surname,status,userID,password,email} =req.body;
    if (name&&surname&&status&&userID&&password&&email) {
        const ck = uuidv4();
        res.cookie('session_id', ck);
        try {
        await db.promise().query(`INSERT INTO user VALUE('${name}','${surname}','${status}','${userID}','${password}','${email}')`);
        await db.promise().query(`INSERT INTO cookie VALUE('${userID}','${ck}') `);
        res.status(201).send({msg: 'Created User'});
        } catch (err) {
            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                res.status(400).send({msg: 'userID already use'})
            } else {
                res.status(500).send({msg: "Internal Error"})
            }
        }
    } else res.status(403).send({msg: 'EROR'});
};
//signin
async function login(req,res) {
    const {userID,password} = req.body;
    if(userID&&password) {
        const checklogin = await db.promise().query(`SELECT user.password FROM USER WHERE user.userID = ${userID}`);
        if (checklogin[0].length >= 1 && checklogin[0][0].password === password){
            const ck = uuidv4();
            res.cookie('session_id', ck);
            try {
                await db.promise().query(`INSERT INTO cookie VALUE('${userID}','${ck}') `);
                res.status(200).send({msg: 'login success'});
            } catch (err) {
                if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                    res.status(400).send({msg: 'There is another login'})
                } else {
                    res.status(500).send({msg: "Internal Error"})
                }
            }
        } else res.status(403).send({msg: 'invalid userID or password'});
    } else res.status(403).send({msg: 'invalid userID or password'});

}
//logout 
async function logout(req,res) {
    await db.promise().query(`DELETE FROM cookie WHERE cookieID = '${req.cookies.session_id}'`);
    try {
        res.clearCookie(session_id);
    } finally {
        res.status(200).send({msg:'log out'});
    }
};
//contactdb
async function contact(req,res) {
    const professor = await db.promise().query(`SELECT name,surname FROM user WHERE user.status = 'professor'`);
    const student = await db.promise().query(`SELECT name,surname FROM user WHERE user.status IN ('student1','student2','student3','student4','master','PH.d')`);
    const staff = await db.promise().query(`SELECT name,surname FROM user WHERE user.status = 'staff'`);
    res.json({ 
        professor : professor[0],
        staff : staff[0],
        student :student[0]
    });

};
//contactinfo
async function contactinfo(req,res) {
    const professorr = await db.promise().query(`SELECT name,surname,status,userID FROM user WHERE user.status = 'professor'`);
    const studentt = await db.promise().query(`SELECT name,surname,status,userID FROM user WHERE user.status IN ('student1','student2','student3','student4','master','PH.d')`);
    const stafff = await db.promise().query(`SELECT name,surname,status,userID FROM user WHERE user.status = 'staff'`);
    res.json({ 
        professor : professorr[0],
        staff : stafff[0],
        student :studentt[0]
    })};



module.exports = {signup,login,logout,contact,contactinfo,validateCookie};