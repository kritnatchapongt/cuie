const {Router, static} = require('express');
const {signup,login,logout,contact,contactinfo,validateCookie} = require('./user')
const {uploadboardcast,getboardcast} =require('./boardcast')
const db = require('../database');
const router = Router();
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
var path = require('path');


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


router.use('/static', static('./picCUIE'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'picCUIE');
    },
    filename: (req, file, cb) => {
        if (!req.context) {
            req.context = {
                picroute: Date.now() + path.extname(file.originalname)
            }
        } else {
            req.context.picroute = Date.now() + path.extname(file.originalname)
        }
        cb(null, Date.now() + path.extname(file.originalname));
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
router.post('/upload', upload.array('image', 100),validateCookie, uploadboardcast);
router.get('/getboardcastt', validateCookie, getboardcast);
module.exports = router;