const {Router, static} = require('express');
const {signup, login, logout, validateCookie} = require('./authen');
const {getContacts, getContactInfo, editProfile} = require('./profile');
const {postFeedUploadMulter, postFeed, getFeeds} = require('./post');
const {getRooms, getRoomInfo, invitechat} = require('./chat');

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
        // Contact/Profile
        userRouter.get('/contacts', getContacts);
        userRouter.get('/contact', getContactInfo);
        userRouter.put('/profile', editProfile);
        // userRouter.put('/profile/pic', editProfilePic);
        userRouter.post('/feed', postFeedUploadMulter.array('files', 100), postFeed);
        userRouter.get('/feeds', getFeeds);
        userRouter.get('/rooms', getRooms);
        userRouter.get('/room', getRoomInfo);
        userRouter.post("/room/invite", invitechat);
    }
    router.use('/user', validateCookie, userRouter);
}


module.exports = { router };