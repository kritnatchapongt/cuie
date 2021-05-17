const {Router, static} = require('express');
const {signup, login, logout, validateCookie} = require('./authen');
const {profilePicUploadMulter, getContacts, getContactInfo, editProfile, editProfilePic} = require('./profile');
const {postFeedUploadMulter, postFeed, getFeeds} = require('./post');
const {groupPicUploadMulter, validateRoom, createRoomSingle, createRoomGroup, getRooms, getRoomInfo, editGroupPic, inviteChat} = require('./chat');

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
        userRouter.put('/profile/pic', profilePicUploadMulter.array('picture', 1), editProfilePic);
        userRouter.post('/feed', postFeedUploadMulter.array('files', 100), postFeed);
        userRouter.get('/feeds', getFeeds);
        userRouter.post('/room/single', createRoomSingle);
        userRouter.post('/room/group', createRoomGroup);
        userRouter.get('/rooms', getRooms);

        const roomRouter = Router();
        {
            roomRouter.get('/info', getRoomInfo);
            roomRouter.put('/pic', groupPicUploadMulter.array('picture', 1), editGroupPic);
            roomRouter.post('/invite', inviteChat);
        }
        userRouter.use('/room', validateRoom, roomRouter);
    }
    router.use('/user', validateCookie, userRouter);
}


module.exports = { router };