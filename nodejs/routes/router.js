const {Router, static} = require('express');
const {signup, login, logout, validateCookie} = require('./authen');
const {getContacts, getContactInfo, editProfile} = require('./profile');
const {postFeedUploadMulter, postFeed, getFeeds} = require('./post');
const {validateRoom, createRoom, getRooms, getRoomInfo, inviteChat} = require('./chat');

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
        userRouter.post('/room', createRoom);
        userRouter.get('/rooms', getRooms);

        const roomRouter = Router();
        {
            roomRouter.get('/info', getRoomInfo);
            roomRouter.post('/invite', inviteChat);
        }
        userRouter.use('/room', validateRoom, roomRouter);
    }
    router.use('/user', validateCookie, userRouter);
}


module.exports = { router };