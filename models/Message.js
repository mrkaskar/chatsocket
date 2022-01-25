const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageSchema = new Schema({
    message:String,
    uuid:String,
    from:{type:Schema.Types.ObjectId, ref:'User'},
    to:{type:Schema.Types.ObjectId, ref:'User'},
    room:String,
    name:String
},{timestamps:true})

module.exports = mongoose.model('Message', messageSchema);