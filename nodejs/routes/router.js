const {Router, static} = require('express');
const {signup, login, logout, contact, contactinfo, validateCookie} = require('./user');
const {uploadpost: uploadpost, getpost: getpost} =require('./post');
const multer = require('multer');
const path = require('path');
const { msghis, invitechat, roomList } = require('./chat');

// Upload files File Server
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.env.PATH_STATIC, 'upload'));
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        const fullpath = path.join(process.env.PATH_STATIC, 'upload', filename);
        console.log(fullpath);
        if (!req.context) {
            req.context = {
                picroute: filename
            };
        } else {
            req.context.picroute = filename;
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
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = Router();
{
    // Authentication
    router.post('/signup', signup);
    router.post('/signin', login);
    router.post('/signout', logout);
    // File Serving
    router.use('/static', static(process.env.PATH_STATIC));

    const userRouter = Router();
    {
        // File Serving
        userRouter.post('/upload', upload.array('image', 100), validateCookie, uploadpost);
        // Contact/Profile
        userRouter.get('/contacts', contact);
        userRouter.get('/contact', contactinfo);
        // userRouter.put('/profile', editProfile);
        // userRouter.put('/profile/pic', editProfilePic);
        // userRouter.post('/feed', uploadPost);
        userRouter.get('/feeds', getpost);
        // userRouter.get('/rooms', getChatrooms);
        userRouter.get('/room', msghis);
        userRouter.post("/room/invite", invitechat);
    }
    router.use('/user', validateCookie, userRouter);
}


module.exports = { router };