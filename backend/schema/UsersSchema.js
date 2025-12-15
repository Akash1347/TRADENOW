const { Schema } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,                
        minlength: 3,         
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,                    
        
    },
    password: {
        type: String,
        required: true,
        minlength: 6         
    },
    verifyOtp:{type:String ,default:""},
    verifyOtpExpireAt:{type:Number ,default:0},
    isAccountVerified:{type:Boolean ,default:false},
    resetOtp:{type:String ,default:""},
    resetOtpExpireAt:{type:Number ,default:0},
    createdAt: {
        type: Date,
        default: Date.now
    }
});

 
module.exports = UserSchema;
