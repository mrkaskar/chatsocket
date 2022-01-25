const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    login_id:String,
    name:String,
    pic:String,
    contacts:{
        type:Array,
        default:[]
    },
    request:{
        type:Array,
        default:[]
    },
    response:{
        type:Array,
        default:[]
    }
},{timestamps:true})

module.exports = mongoose.model('User', userSchema);