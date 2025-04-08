
const mongoose = require('mongoose');

const User = require('../schemas/userSchema.js');
const Friend = require('../schemas/friendsSchema.js');
const { generateToken,decodeToken } = require('../auth/jwt.js');
const History = require("../schemas/historySchema.js");



//new user
module.exports.newUser= async (req, res) => {
    const { name,email,password,login,Admin} = req.body;
    console.log(name,email,password,login);
    try {
        const unique= await User.findOne({$or:[ {"email":email},{"login":login}] })
        if(unique){
          //  console.log(unique);
            return res.status(403).json({success:false,data:"login or email already exists"});
        }
        const user = new User(
            {
                'name':name,
                'email':email,
                'password':password,
                'login':login,
                'Admin':Admin,
            });

        const token = generateToken({ id: user._id });
        await user.save();
        const history=new History({
            user:user.id,
            objekt:"user",
            action:"rejestred"
        })
        await history.save()
        res.status(201).json({success:true,token:token,data:"User zapisany pomyślnie."});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zapisywania usera." });
    }
}
//wszystkie usery
module.exports.allUsers=  async (req, res) => {
    console.log("all Users")

    try {
// Tworzymy nowego pracownika.

// Wstawiamy pracownika do bazy danych.
        const user=await User.find()
        user.map(u=>u.password=null)
        res.status(200).json({success:true,data:user});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas pobieranie usera." });
    }

}
//profile użytkonwika
module.exports.getUserProfile=  async (req, res) => {
    console.log("getProfile")
    const id=req.params.id
    console.log(id);
    try {
// szukamy usera o podanym id
        const user=await User.findById(id)

        if(!user){return res.status(404).json({success:false,data:"user is not exist"});}
        user.password=null
        res.status(200).json({success:true,data:user});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas pobieranie usera." });
    }
}
//updateProfile
module.exports.updateProfile= async (req, res) => {
    console.log("update profile")
console.log(req.user.id.toString())
    const id=req.params.id
    console.log(id);
    const {name, email,login,opis,wiek,image,miasto} = req.body;
    try {

        if(!(id===req.user.id.toString()||req.user.Admin))
            return  res.status(401).json({success:false,data:"Nie masz dostępu do edycji tego konta"});
        const iAm= await User.findById( id )
        let uniqueLogin=null;
        let uniqueEmail=null;
        if(iAm.login!==login)
            uniqueEmail= await User.findOne( {"email":email} );
        if(iAm.email!==email)

         uniqueLogin= await User.findOne({"login":login} )
        if(uniqueLogin||uniqueEmail){
            //  console.log(unique);
            return res.status(401).json({success:false,data:"login or email already exists"});
        }
        if(!mongoose.Types.ObjectId.isValid(id))
            return  res.status(404).json({success:false,data:"podaj poprawny id"});

        const user=await User.findByIdAndUpdate(id,{$set:{name,email,login,opis,wiek,image,miasto}},{runValidators:true})
        if(!user)
            return  res.status(404).json({success:false,data:"user o podanym id nie istnieje"});
        else {
            if(login) {
                const up1 = await Friend.updateMany({user1: id}, {$set: {login1: login}})
                const up2 = await Friend.updateMany({user2: id}, {$set: {login2: login}})
            }
            const history=new History({
                user:user.id,
                objekt:"user",
                action:"changed profile"
            })
            await history.save()
           res.status(200).json({success: true, data:"dane zostaly zmienione"});
        }
        } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas updatowania usera." });
    }


};

module.exports.settings= async (req,res)=>{
    const id=req.params.id;
    const {darkmode}=req.body;
    try {


        const user=await User.findByIdAndUpdate(id,{$set:{darkmode:darkmode}})
        if(!user)
            return  res.status(404).json({success:false,data:"user not found"});
            res.status(200).json({success: true, data:"dane zostaly zmienione"});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas ustawienia." });
    }
}




//db.User.insertOne(user)
// {
//     'name':'first',
//     'email':'w@2.com',
//     'password':'qwerty',
//     'login':'pierwszy'
// }