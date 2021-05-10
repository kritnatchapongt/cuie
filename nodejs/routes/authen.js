const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');

async function validateCookie(req, res, next){
    const {cookies} = req;
    if ('session_id' in cookies){
        const query = await db.promise().query(`
            SELECT *
            FROM cookie
            WHERE cookieID = '${cookies.session_id}'
        `);
        if(query[0].length > 0){
            req.data = {
                userID: query[0][0].userID,
                socketID: query[0][0].socketID
            };
            next();
        } else {
            res.status(401).send({msg:'Not Authenticated'});
            return;
        }
    } else {
        res.status(401).send({msg:'Not Authenticated'});
        return;
    }
}

async function signup(req, res) {
    const {name, surname, status, userID, password, email} = req.body;
    if (!(name && surname && status && userID && password && email)) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }

    const ck = uuidv4();
    res.cookie('session_id', ck);
    try {
        await db.promise().query(`
            INSERT INTO user
            (name, surname, status, userID, password, email)
            VALUES('${name}','${surname}','${status}','${userID}','${password}','${email}')
        `);
        await db.promise().query(`
            INSERT INTO cookie
            (userID, cookieID)
            VALUES('${userID}','${ck}')
        `);
        res.status(200).send({msg: 'Created User'});
        return;
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            res.status(403).send({msg: 'userID already use'});
            return;
        } else {
            console.log(err);
            res.status(500).send({msg: "Internal Error"});
            return;
        }
    }
}

async function login(req, res) {
    const {userID, password} = req.body;
    if(!(userID && password)) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }

    const checklogin = await db.promise().query(`
        SELECT user.password
        FROM user
        WHERE user.userID = '${userID}'
    `);
    if (checklogin[0].length < 1 || checklogin[0][0].password !== password) {
        res.status(401).send({msg: 'invalid userID or password'});
        return;
    }

    const ck = uuidv4();
    res.cookie('session_id', ck);
    try {
        await db.promise().query(`
            UPDATE cookie
            SET cookieID = '${ck}'
            WHERE userID = '${userID}'
        `);
        res.status(200).send({msg: 'login success'});
        return;
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            // Deprecated
            res.status(403).send({msg: 'There is another login'});
            return;
        } else {
            console.log(err);
            res.status(500).send({msg: "Internal Error"});
            return;
        }
    }
}

async function logout(req, res) {
    try {
        await db.promise().query(`
            UPDATE cookie
            SET cookieID = NULL
            WHERE cookieID = '${req.cookies.session_id}'
        `);
        res.clearCookie(req.cookies.session_id);
    } finally {
        res.status(200).send({msg:'log out'});
    }
    return;
}

module.exports = {signup, login, logout, validateCookie};