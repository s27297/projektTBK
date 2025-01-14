let mongoose=require("mongoose")
const {Schema} = require("mongoose");


const commentSchema=new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User jest wymagane']
    },
    tagged: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Posts",
        required: [true, 'Post jest wymagane']
    },
    text: {
        type: String,
        required: [true, 'Text jest obowiazkowy'],
        minLength: [5, "text musi byc wiekszy od 4 znakow"]
    },
},{versionKey:false}
)

let comments=mongoose.model('Comments',commentSchema)

module.exports=comments


