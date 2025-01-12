let mongoose=require("mongoose")
const {Schema} = require("mongoose");



const messageSchema=new Schema({
    text: {
        type:String,
        required:[true,'text jest wymagany'],
        minlength:[1,'text musi miec co najmniej 1 znak']
    },

    from:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'sender jest wymagany']
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'otrzymujacy jest wymagany']
    }

})

let message=mongoose.model('Messages',messageSchema)

module.exports=message


