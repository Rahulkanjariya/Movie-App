const mongoose = require("mongoose");

const MoviesSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    name:{
        type:String
    },
    desc:{
        type:String
    },
    image:{
        type:String
    },
    category:{
        type:String
    },
    language:{
        type:String
    },
    date:{
        type:String
    },
    video:{
        type:String
    },
    ratings:[{
        star:Number,
        comment:String,
        postedby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
    }],
    totalrating:{
        type:String,
        default: 0,
    },
},{timestamps:true});

module.exports = mongoose.model("Movies",MoviesSchema);