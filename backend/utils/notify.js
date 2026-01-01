let ioRef;

function initNotifier(io){
    ioRef = io;
}

function notifyUser(userId ,payload){
    if(!ioRef) return;

    ioRef.to(userId.toString()).emit('notification', payload);
}

module.exports = {
    initNotifier,
    notifyUser
};