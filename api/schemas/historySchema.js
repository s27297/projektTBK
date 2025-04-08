let mongoose=require("mongoose")
const {Schema} = require("mongoose");



const historySchema=new Schema({
    user:{type:Schema.Types.ObjectId,
    ref:"User",
    required:[true,'user jest wymagany']},
    objekt:{type:String,
        enum:["user","post","group"],
        required:[true,'objekt jest wymagany']},
    action:{type:String,required:[true,'Action jest wymagane']},
    date:{type:Date,default:Date.now},
},{versionKey:false})

let history=mongoose.model('History',historySchema)

module.exports=history


