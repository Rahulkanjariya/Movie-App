const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    likedMovies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Movies",
        },
    ],
},{timestamps:true})

module.exports = mongoose.model("User",UserSchema);
