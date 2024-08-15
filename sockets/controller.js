import { checkJWT } from "../helpers/index.js";

import { ChatMessages } from "../models/index.js";

const chatMessages = new ChatMessages();


const socketController = async(socket, io) => {

    const user = await checkJWT(socket.handshake.headers['x-token']);

    if (!user) {
        return socket.disconnect();
    }
    
    console.log('Cliente conectado', user.name);

    // Add user connected
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.UsersArr);
    socket.emit('receive-messages', chatMessages.last10);

    // Conectarlo a una sala especial
    socket.join(user.id); // Global - socket.oi and user.id

    // Clean up when a user logs off
    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);

        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.UsersArr);
    });

    socket.on('send-message', ({uid, message}) => {
        // console.log(payload);

        if (uid) {
            // Private messages
            socket.to(uid).emit('private-messages', {de: user.name, message})
            
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chatMessages.last10);
        }


    });
}

export {
    socketController
}