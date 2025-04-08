let mongoose=require("mongoose")
const {Schema} = require("mongoose");



const notAcceptedTextSchema=new Schema({
    postId:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:[true,'PostId jest wymagane']},
    userAsked: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'UserAsked jest wymagane'],
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'user jest wymagane']
    },
    commitId:{
        type:Schema.Types.ObjectId,
        ref:"Comments",
        required:[true,'commitId jest wymagane']
    },
    text:{
        type:String,
        required:[true,'Text jest wymagane']
    },

},{versionKey:false})

let notAcceptedTexsts=mongoose.model('NotAcceptedTexsts',notAcceptedTextSchema)

module.exports=notAcceptedTexsts


