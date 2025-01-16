
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Friend = require('../schemas/friendsSchema');
const { generateToken,decodeToken } = require('../auth/jwt');



//////////////////////////////friends.router
module.exports.getUserFriends= async (req, res) => {
    console.log("get User friends")
const {accepted}=req.body||true;
    const id=req.user.id

    try {
        const user=await User.findById(id)
        if(!user)
            res.status(404).json({success:false,data:"user not found"});
        const friends=await Friend.find
        ({$or:[{"user1":user},{"user2":user}],accepted: accepted})
        if(!friends.length)
            return res.status(404).json({success:false,data:"user has no friends"});
        let friendsIds=[]
        console.log(friends)
        friends.map((friend)=>{friend.user1.toString()!==id?friendsIds.push(friend.login1):friendsIds.push(friend.login2)})
        res.status(200).json(friends);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas pobieranie usera." });
    }
}

module.exports.addUserFriend=  async (req, res) => {
    console.log("add User friend")
    const id=req.user.id
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
    const { login} = req.body;
    const id=req.user.id
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
            return res.status(404).json({success:false,data:"usery z takimi danymi nie wysylali zaproszenie do przyjacelstwa "})
        else {
            res.status(200).json({success:true,data:"teraz nie przyjaciele"});
        }

    } catch (err) {
//z
        console.log(err);
        res.status(500).json({ error: "blad podczas usunuecia friendow.." });
    }
}


module.exports.acceptUserFriend=  async (req, res) => {
    console.log("accept User friend")

    const id=req.params.id

    try {
        const friend=await Friend.findOneAndUpdate
        ({_id:id,accepted:false},{$set:{accepted:true}})
        if(!friend)
            return res.status(404).json
            ({success:false,data:"usery z takimi danymi nie wysylali zaproszenie do przyjacelstwa"})
            res.status(200).json({success:true,data:"teraz przyjaciele"});
    } catch (err) {
//z
        console.log(err);
        res.status(500).json({ error: "blad podczas acceptowania friendow.." });
    }
}

module.exports.odrzutUserFriend=  async (req, res) => {
    console.log("odrzuc User friend")

    const id=req.params.id
    try {
        const friend=await Friend.findByIdAndDelete(id)
        if(!friend)
            return res.status(404).json({success:false,data:"usery z takimi danymi nie sa przyjaciolmi "})
        res.status(200).json({success:true,data:"zaproszenie odrzucone"});
    } catch (err) {
//z
        console.log(err);
        res.status(500).json({ error: "blad podczas odrzuta zaproszenia friendow.." });
    }
}



//
// module.exports.acceptUserFriend=  async (req, res) => {
//     console.log("accept User friend")
//     const { login} = req.body;
//     const id=req.user.id
//     try {
//         const user=await User.findOne({"login":login})
//         const user2=await User.findById(id)
//         if(!user2)
//             return res.status(404).json({success:false,data:"user z takim id nie znalazony "});
//
//         if(!user)
//             return res.status(404).json({success:false,data:"user z takim loginem nie znalazony "});
//         const friend=await Friend.findOneAndUpdate
//         ({$or:[{"login1":login,"login2":user2.login},{"login1":user2.login,"login2":login}]}
//             ,{$set:{accepted:true}})
//         if(!friend)
//             return res.status(404).json({success:false,data:"usery z takimi danymi nie sa przyjaciolmi "})
//         else {
//             res.status(200).json({success:true,data:"teraz nie przyjaciele"});
//         }
//
//     } catch (err) {
// //z
//         console.log(err);
//         res.status(500).json({ error: "User nie znalezony." });
//     }
// }