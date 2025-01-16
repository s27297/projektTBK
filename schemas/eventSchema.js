let mongoose=require("mongoose")
const {Schema} = require("mongoose");


const eventSchema=new Schema({
        name:{
            type:String,
            required:[true,'Nazwa jest obowiazkowa']},
            creator:{type:Schema.Types.ObjectId,
                ref:"User",
                required:[true,'creator jest wymagane']},
        date:{
            type:Date,
            required:[true,'Data jest obowiazkowa']},
        participants: {
            type:[Schema.Types.ObjectId]},
        text: {
            type: String,
            required: [true, 'Text jest obowiazkowy'],
            minLength: [5, "text musi byc wiekszy od 4 znakow"]
        },
    },{versionKey:false}
)

let events=mongoose.model('Events',eventSchema)

module.exports=events


