const {isEmail}=require( "validator");
let mongoose=require("mongoose")
const {Schema} = require("mongoose");



const postsSchema=new Schema({
    header:{
        type:String,
        required:[true,'header jest wymagany'],
        minlength:[3,'header musi miec co najmniej 3 znaki']},
    text: {
        type:String,
        required:[true,'text jest wymagany'],
        minlength:[3,'text musi miec co najmniej 3 znaki']
    },
    likes:{
        type:Array,
        default:[],
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,'User jest wymagane']
    },
    share:{
        type:String,
        enum:["All","friends","None"],
        default:"All"
    }

})

let posts=mongoose.model('Posts',postsSchema)

module.exports=posts


