const {Router, static} = require('express');
const {signup,login,logout,contact,contactinfo,validateCookie} = require('./user')
const {uploadpost: uploadpost,getpost: getpost} =require('./post')
const db = require('../database');
const router = Router();
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
var path = require('path');
const { msghis,invitechat,roomList } = require('./chat');


//signup
router.post('/signup', signup);
//signin
router.post('/signin', login);
//logout 
router.post('/signout',validateCookie, logout);
//contactdb
router.get('/contacts', contact);
//contactinfo
router.get('/contacts/info', contactinfo);


router.use('/static', static(process.env.PATH_STATIC));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.PATH_STATIC, 'upload'))
    },
    filename: (req, file, cb) => {
        filename = Date.now() + path.extname(file.originalname)
        fullpath = path.join(process.env.PATH_STATIC, 'upload', filename)
        console.log(fullpath)
        if (!req.context) {
            req.context = {
                picroute: filename
            }
        } else {
            req.context.picroute = filename
        }
        cb(null, filename);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'||file.mimetype == 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post('/upload', upload.array('image', 100),validateCookie, uploadpost);
router.get('/getboardcast', validateCookie, getpost);
router.get('/getchathistory', validateCookie, msghis);
router.post("/invitemember",invitechat);
module.exports = router;