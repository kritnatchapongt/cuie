const db = require('../util/database');

async function getContacts(req, res) {
    var {pattern, status} = req.query;
    pattern = (pattern) ? `%${pattern}%` : '%';
    status = (status) ? `%${status}%` : '%';
    
    const query = await db.promise().query(`
        SELECT userID, name, surname, status
        FROM user
        WHERE (name LIKE '${pattern}' OR surname LIKE '${pattern}') AND status LIKE '${status}';
    `);

    const users = query[0];
    const professors = users.filter(user => user.status.includes('professor'));
    const students = users.filter(user => user.status.includes('student'));
    const staffs = users.filter(user => user.status.includes('staff'));
    res.status(200).send({ 
        all: users,
        professors: professors,
        students: students,
        staffs: staffs
    });
}

async function getContactInfo(req, res) {
    const {userid: userID} = req.query;
    if (!userID) {
        res.status(400).send({msg: 'Bad Request'});
    }

    const query = await db.promise().query(`
        SELECT userID, name, surname, status, email, bio, picpath
        FROM user
        WHERE user.userID = '${userID}'
    `);
    if (query[0].length < 1) {
        res.status(401).send({msg: 'Invalid userID'});
    }

    res.status(200).send(query[0][0]);
}

async function editProfile(req, res) {
    const {name, surname, status, major, bio} = req.body;
    if (!(name && surname && status && major && bio)) {
        res.status(400).send({msg: 'Bad Request'});
    }

    try {
        await db.promise().query(`
            UPDATE user
            SET name='${name}', surname='${surname}', status='${status}', major='${major}', bio='${bio}'
            WHERE userID='${req.data.userID}';
        `);
        res.status(200).send({name, surname, status, major, bio});
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: "Internal Error"});
    }
}

module.exports = {getContacts, getContactInfo, editProfile};