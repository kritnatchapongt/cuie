const {v4: uuidv4} = require('uuid');
const db = require('../util/database');
const {datesql} = require('../util/functions');
const {validateSocket, login, disconnect} = require('./authen');
const { sendChat } = require('./chat');

function createSocketMapper(io) {
    return function (socket) {
        /*
        Clients are provided with these events to emit:
            Testings:
                'test_public:send' [any]        => To test emitting globally, by pinging server and letting server emit everyone
                'test_private:send' [any]       => To test sending privately, by pinging server and letting server ping back
                'test_chatroom' [ChatSendOb     => Send chat to any roomID without saving into database
            APIs:
                'signin' [LoginObj]             => First event to be emitted, in order to join chatrooms properly
                'chat:send' [ChatSendObj]       => Send chat to any roomID (that is accessible to the user)

        Clients are required to prepare receiving each events as followed:
            Defaults:
                'connect' []                    => Fired upon connection
                'disconnect' [string]           => Fired upon disconnection
            Testings:
                'test_public:receive' [any]     => To print whatever broadcasted globally from 'test_public:send'
                'test_public:receive' [any]     => To print whatever sent privately from 'test_private:send'
            APIs:
                'chat:receive' [ChatReceiveObj] => Receive message from any room including broadcasted message
            API Responses:
                'signin:response' [ResObj]      => Response from 'signin'
                'chat:send:response' [ResObj]   => Response from 'chat:send'
        
        Note that for any unfamiliar types that are listed above, the syntaxes are as below:
            LoginObj {
                userID: string
                password: string
            }
            ChatSendObj {
                roomID: string
                message: string
                messageType: string ('TEXT')
            }
            ChatReceiveObj {
                messageID: string
                senderID: string
                message: string
                messageType: string ('TEXT')
                sendtime: string (timestamp)
            }
            ResObj {
                success: bool
                status: int
                message: string
                param: any
            }
        */

        console.log('Connected ' + socket.id);
        socket.use(validateSocket(io, socket, ['chat:send']));

        socket.on('test_public:send', async function (obj) {
            console.log(obj);
            io.emit('test_public:receive', obj);
        });
        socket.on('test_private:send', async function (obj) {
            console.log(socket.id + ': ' + obj);
            io.to(socket.id).emit('test_private:receive', obj);
        });
        socket.on('test_chatroom', async function (obj) {
            const { roomID, message } = obj;
            console.log('[' + roomID + '] ' + socket.id + ': ' + message);
            io.in(roomID).emit('chat:receive', message);
        });
        
        socket.on('signin', login(io, socket));
        socket.on('chat:send', sendChat(io, socket));
        
        socket.on('disconnect', disconnect(io, socket));
        socket.on("error", (err) => {
            io.to(socket.id).emit("app_error", {
                success: false,
                status: 500,
                message: (err) ? err.message : "Internal Server Error",
                param: null
            });
        });
    };
}

module.exports = {createSocketMapper};