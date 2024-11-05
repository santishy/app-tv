const {model, Schema} = require('mongoose');

const userSchema = Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type: Boolean,
        default: true
    }
});

module.exports = model('User',userSchema);