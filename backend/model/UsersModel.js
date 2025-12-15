const {model} = require("mongoose")

const UserSchema = require("../schema/UsersSchema")


const User = new model("user" ,UserSchema);

module.exports = User