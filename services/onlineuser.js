let onlineUsers = [];

const addOnline = (uid) => {
    
    if(!onlineUsers.includes(uid))
    onlineUsers.push(uid);
}

const removeOnline = (skid) => {
    onlineUsers = onlineUsers.filter(u=>u.skid!=skid);
}

const getOnline = () => {
    return onlineUsers;
}

module.exports = {addOnline, removeOnline, getOnline}