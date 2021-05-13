require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const {initStaticFolder} = require('./util/init');
const {router} = require('./routes/router');
const {createSocketMapper} = require('./sockets/map');

initStaticFolder();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});
app.use(router);
app.use('/', express.static('/usr/src/app/public'));

io.on('connection', createSocketMapper(io));

http.listen(3000, function () {
    console.log('listening to PORT 3000');
});