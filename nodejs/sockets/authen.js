const db = require('../util/database');

function validateSocket(io, socket, events) {
    return async function (packet, next) {
        const eventName = packet[0];
        if (events.includes(eventName)) {
            if (!socket.data || !socket.data.isLogin) {
                io.to(socket.id).emit(eventName + ':response', {
                    success: false,
                    status: 401,
                    message: "Socket is not authenticated",
                    param: null
                });
                return;
            }

            const query = await db.promise().query(`
                SELECT userID
                FROM cookie
                WHERE socketID = '${socket.id}'
            `);
            if (query[0].length < 1) {
                socket.data.isLogin = false;
                io.to(socket.id).emit(eventName + ':response', {
                    success: false,
                    status: 401,
                    message: "Socket is not authenticated",
                    param: null
                });
                return;
            }
        }
        next();
    };
}

function login(io, socket) {
    return async function (req) {
        const { userID, password } = req;
        const socketID = socket.id;

        if(!(userID && password)) {
            io.to(socket.id).emit('signin:response', {
                success: false,
                status: 400,
                message: "Both userID and password is required",
                param: null
            });
            return;
        }

        const checklogin = await db.promise().query(`
            SELECT user.password
            FROM user
            WHERE user.userID = '${userID}'
        `);
        if (checklogin[0].length < 1 || checklogin[0][0].password !== password) {
            io.to(socket.id).emit('signin:response', {
                success: false,
                status: 401,
                message: "Invalid userID or password",
                param: null
            });
            return;
        }

        try {
            await db.promise().query(`
                UPDATE cookie
                SET socketID = '${socketID}'
                WHERE userID = '${userID}'
            `);
        } catch (err) {
            io.to(socket.id).emit('signin:response', {
                success: false,
                status: 500,
                message: "Internal Server Error",
                param: null
            });
            return;
        }

        const query = await db.promise().query(`
            SELECT roomID
            FROM roomuser
            WHERE userID = '${userID}'
        `);
        const roomIDs = query[0].map(row => row.roomID);

        if (socket.data) {
            socket.data.isLogin = true;
            socket.data.userID = userID;
        } else {
            socket.data = {
                isLogin: true,
                userID: userID
            };
        }
        socket.join(roomIDs);
        io.to(socket.id).emit('signin:response', {
            success: true,
            status: 200,
            message: "Login Successful",
            param: socket.data.userID
        });
    };
}

function disconnect(io, socket) {
    return async function (obj) {
        if (obj) {
            console.log(obj + ' ' + socket.id);
        }
        if (socket.data && socket.data.isLogin) {
            try {
                await db.promise().query(`
                    UPDATE cookie
                    SET socketID = NULL
                    WHERE userID = '${socket.data.userID}' AND socketID = '${socket.id}'
                `);
            } catch (err) {
                console.log(err);
            }
        }
    };
}

module.exports = {validateSocket, login, disconnect};