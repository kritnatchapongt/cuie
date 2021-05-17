const db = require('../util/database');
const { addSlash } = require('../util/functions');
const multer = require('multer');
const path = require('path');

// File upload for PUT Profile Pic multipart
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.PATH_STATIC, 'profiles'));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now().toString() + req.data.userID + path.extname(file.originalname);
        const relPath = path.join('profiles', fileName);
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
const profilePicUploadMulter = multer({ storage, fileFilter });

async function getContacts(req, res) {
    var {pattern, status} = req.query;
    pattern = (pattern) ? `%${pattern}%` : '%';
    status = (status) ? `%${status}%` : '%';
    
    const query = await db.promise().query(`
        SELECT userID, name, surname, status, picpath
        FROM user
        WHERE (name LIKE '${pattern}' OR surname LIKE '${pattern}') AND status LIKE '${status}' AND userID != '${req.data.userID}';
    `);
    
    const users = query[0].map(row => {
        row.picpath = addSlash(row.picpath);
        return row;
    });
    const professors = users.filter(user => user.status.includes('professor'));
    const students = users.filter(user => user.status.includes('student'));
    const staffs = users.filter(user => user.status.includes('staff'));
    res.status(200).send({
        all: users,
        professors: professors,
        students: students,
        staffs: staffs
    });
    return;
}

async function getContactInfo(req, res) {
    let {userid: userID} = req.query;
    if (!userID) {
        userID = req.data.userID;
    }

    const query = await db.promise().query(`
        SELECT userID, name, surname, status, email, bio, picpath
        FROM user
        WHERE user.userID = '${userID}'
    `);
    if (query[0].length < 1) {
        res.status(400).send({msg: 'Invalid userID'});
        return;
    }

    const contact = query[0][0];
    contact.picpath = addSlash(contact.picpath);
    res.status(200).send(contact);
    return;
}

async function editProfile(req, res) {
    const {name, surname, status, major, bio} = req.body;
    if (!(name && surname && status && major && bio)) {
        res.status(400).send({msg: 'Bad Request'});
        return;
    }

    try {
        await db.promise().query(`
            UPDATE user
            SET name='${name}', surname='${surname}', status='${status}', major='${major}', bio='${bio}'
            WHERE userID='${req.data.userID}';
        `);
        res.status(200).send({name, surname, status, major, bio});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).send({msg: "Internal Error"});
        return;
    }
}

async function editProfilePic(req, res) {
    if (!req.context.upload) {
        res.status(500).send({msg: "File upload failed"});
        return;
    }

    const filePath = req.context.upload.relPath;
    const userID = req.data.userID;

    await db.promise().query(`
        UPDATE user
        SET picpath = '${filePath}'
        WHERE userID = '${userID}';
    `);

    res.status(200).send({msg: 'Profile picture updated successfully'});
    return;
}

module.exports = {profilePicUploadMulter, getContacts, getContactInfo, editProfile, editProfilePic};