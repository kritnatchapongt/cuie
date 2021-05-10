const db = require('../util/database');
const { addSlash } = require('../util/functions');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

// File upload for POST feed multipart
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.PATH_STATIC, 'files'));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now().toString() + req.data.userID + path.extname(file.originalname);
        const relPath = path.join('files', fileName);
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
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const postFeedUploadMulter = multer({ storage, fileFilter });

async function postFeed(req, res){
    const {head, body, targets} = JSON.parse(req.body.info);
    if (!(head && body && targets && Array.isArray(targets) && targets.every(target => typeof target === 'string'))) {
        res.status(400).send({msg: "Bad Request"});
        return;
    }
    if (!req.context.upload) {
        res.status(500).send({msg: "File upload failed"});
        return;
    }

    const filePath = req.context.upload.relPath;
    const senderID = req.data.userID;
    const postid = uuidv4();
    await db.promise().query(`
        INSERT INTO post
        (postID, head, body, senderID, filepath)
        VALUE('${postid}', '${head}', '${body}', '${senderID}', '${filePath}')
    `);

    for(var i = 0; i < targets.length; i++) {
        db.promise().query(`
            INSERT INTO posttarget
            (postID, target)
            VALUE('${postid}', '${targets[i]}')
        `);
    }
    
    res.status(200).send({msg: 'Feed posted successfully'});
    return;
}

async function getFeeds(req, res){
    const query = await db.promise().query(`
        SELECT p.postID, p.head, p.body, p.senderID, p.posttime, p.filepath
            FROM post as p
            INNER JOIN posttarget as pt
                ON p.postID = pt.postID
            WHERE pt.target = '${req.data.userID}'
        UNION
        SELECT p.postID, p.head, p.body, p.senderID, p.posttime, p.filepath
            FROM post as p
            WHERE p.senderID = '${req.data.userID}'
        ORDER BY posttime DESC;
    `);
    const feeds = query[0].map(row => {
        row.filepath = addSlash(row.filepath);
        return row;
    });
    res.status(200).send(feeds);
    return;
}

module.exports = {postFeedUploadMulter, postFeed, getFeeds};