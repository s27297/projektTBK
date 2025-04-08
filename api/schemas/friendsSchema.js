const {isEmail}=require( "validator");
let mongoose=require("mongoose")
const {Schema} = require("mongoose");

const User=require("./userSchema");



const friendsSchema=new Schema({
    user1:{
        type:Schema.Types.ObjectId,
    ref:"User",
    required:[true,'User1 jest wymagane']},
    login1:{type:String, required:[true,'login1 jest wymagane']},
    user2:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'User2 jest wymagane']},
    login2:{type:String, required:[true,'login1 jest wymagane']},
    accepted:{type:Boolean,default:false},

},{versionKey:false})

let friend=mongoose.model('Friends',friendsSchema)

module.exports=friend


