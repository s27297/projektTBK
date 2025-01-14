
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Friend = require('../schemas/friendsSchema');
const { generateToken,decodeToken } = require('../auth/jwt');



//new user
module.exports.newUser= async (req, res) => {
    console.log("new User")
    const { name,email,password,login} = req.body;
    console.log(name,email,password,login);
    try {
        const unique= await User.findOne({$or:[ {"email":email},{"login":login}] })
        if(unique){
          //  console.log(unique);
            return res.status(401).json({success:false,data:"login or email already exists"});
        }
        const user = new User(
            {
                'name':name,
                'email':email,
                'password':password,
                'login':login
            });

        const token = generateToken({ id: user._id });
        await user.save();
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
        res.status(200).json(user);
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
// szukamy pracownika o podanym id
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
//trzeba dodac pola
module.exports.updateProfile= async (req, res) => {
    console.log("update profile")
console.log(req.user.id.toString())
    const id=req.params.id
    console.log(id);
    const {name, email,login,opis,wiek,image} = req.body;
    try {

        if(!(id===req.user.id.toString()||req.user.Admin))
            return  res.status(401).json({success:false,data:"Nie masz dostępu do edycji tego konta"});
        const unique= await User.findOne({$or:[ {"email":email},{"login":login}] })
        if(unique){
            //  console.log(unique);
            return res.status(401).json({success:false,data:"login or email already exists"});
        }
        if(!mongoose.Types.ObjectId.isValid(id))
            return  res.status(404).json({success:false,data:"podaj poprawny id"});

        const user=await User.findByIdAndUpdate(id,{$set:{name,email,login,opis,wiek,image}})
        if(!user)
            return  res.status(404).json({success:false,data:"user o podanym id nie istnieje"});
        else {
            if(login) {
                const up1 = await Friend.updateMany({user1: id}, {$set: {login1: login}})
                const up2 = await Friend.updateMany({user2: id}, {$set: {login2: login}})
            }
           res.status(200).json({success: true, data:"dane zostaly zmienione"});
        }
        } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas updatowania usera." });
    }


};

module.exports.getUserFriends= async (req, res) => {
    console.log("get User friends")

    const id=req.params.id
    console.log(id);
    try {
        const user=await User.findById(id)
        if(!user)
            res.status(404).json({success:false,data:"user not found"});
        const friends=await Friend.find({$or:[{"user1":user},{"user2":user}]})
        if(!friends)
            res.status(404).json({success:false,data:"user has no friends"});
        let friendsIds=[]
        console.log(friends)
        friends.map((friend)=>{friend.user1.toString()!==id?friendsIds.push(friend.login1):friendsIds.push(friend.login2)})
        res.status(200).json(friendsIds);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas pobieranie usera." });
    }
}

module.exports.addUserFriend=  async (req, res) => {
    console.log("add User friend")

    const id=req.params.id
    const { login} = req.body;
    console.log(id,login);
    const user1=req.user
    console.log(user1._id)
    try {


        const user2=await User.findOne({"login":{$regex:login}})
        if(!user2)
            res.status(404).json({success:false,data:"user z takim loginem nie znalazony"});
        //
        // const user1=await User.findById(id)
        // if(!user1)
        //     res.status(404).json({success:false,data:"user z takim id nie znalazony"})
        // console.log(user2)
        const newfriend=new Friend({
            user1:user1.id,
            login1:user1.login,
            user2:user2._id,
            login2:user2.login

        })
        if(user1.login===user2.login)
            return res.status(400).json({success:false,data:"to musa byc rozne uzytkownicy"});
        const f=await Friend.findOne
        ({$or:[{"user1":user1._id,"user2":user2._id},{"user2":user1._id,"user1":user2._id}]})
        if(f)
            return res.status(400).json({success:false,data:"juz istnieje"});
        else {
            await newfriend.save();
            res.status(200).json({success:true,data:newfriend});

        }


    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
//z
        console.log(err);
        res.status(500).json({ error: "blad podczas tworzenia friendow." });
    }
}


module.exports.deleteUserFriend=  async (req, res) => {
    console.log("delete User friend")

    const id=req.params.id
    // const _id=req.user._id
    const { login} = req.body;
    console.log(id,login);

    try {



        const user=await User.findOne({"login":login})
        const user2=await User.findById(id)
        if(!user2)
            return res.status(404).json({success:false,data:"user z takim id nie znalazony "});

        if(!user)
            return res.status(404).json({success:false,data:"user z takim loginem nie znalazony "});
        const friend=await Friend.findOneAndDelete
        ({$or:[{"login1":login,"login2":user2.login},{"login1":user2.login,"login2":login}]})
        if(!friend)
            return res.status(404).json({success:false,data:"usery z takimi danymi nie sa przyjaciolmi "})
        else {
            res.status(200).json({success:true,data:"teraz nie przyjaciele"});
        }

    } catch (err) {
//z
        console.log(err);
        res.status(500).json({ error: "User nie znalezony." });
    }
}

module.exports.settings= async (req,res)=>{}




//db.User.insertOne(user)
// {
//     'name':'first',
//     'email':'w@2.com',
//     'password':'qwerty',
//     'login':'pierwszy'
// }