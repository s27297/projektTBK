let mongoose=require("mongoose")
const {Schema} = require("mongoose");



const groupSchema=new Schema({
    name:{
        type:String,
        required:[true,'name jest wymagane'],
        // unique:[true,"nazwa gruppy musi byc unikalna??"],
    },
    participants: {type:Array}


})

let groups=mongoose.model('Groups',groupSchema)

module.exports=groups


