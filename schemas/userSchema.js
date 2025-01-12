const {isEmail}=require( "validator");
let mongoose=require("mongoose")
const {Schema} = require("mongoose");
const { hashPassword } = require('../auth/passwordUtils');


const userSchema=new Schema({
    name:{
        type:String,
        minlength:[3,'imie musimiec co najmniej 3 znaki']},
    nazwisko:{type:String,
        minlength:[3,'imie musimiec co najmniej 3 znaki']},
    opis:{type:String},
    wiek:{type:Number,min:[10,"wiek musi byc wiekszy od 1"],max:[200,"wiek musi byc mniejszy od 200"]},
    image:{data:Buffer,contentType:"String"},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true,'email musi byc unikalny'],
        required: 'Email address is required',
        validate: [ isEmail, 'invalid email' ]
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,'password jest wymagany'],
        minLength:[4,'password musi miec co najmniej 4 znaki '],
    },
    login:{
        type:String,
        required:[true,'Login jest wymagany'],
        unique: [true,'Login jest unikatowy'],
    },
    Admin:{
        type:Boolean,
        default:false,
    }
    // friends:{type:Array}
})

// Middleware przed zapisem - hashowanie hasła
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});

// Metoda do sprawdzania czy użytkownik jest adminem
userSchema.methods.isAdmin = function() {
    return this.Admin===true ;
};
let user=mongoose.model('User',userSchema)

module.exports=user


