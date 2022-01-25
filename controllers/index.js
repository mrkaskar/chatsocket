const Message = require('../models/Message');

exports.saveMessage = (message,uuid,from,to,room,name) => {
    const msg = new Message(
        {
            message,
            uuid,
            from,
            to,
            room,
            name
        }
    )

    msg.save();
}