
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Message = require('../schemas/messageSchema');
const Group = require('../schemas/groupSchema');




//get message
module.exports.getGroups= async (req, res) => {

    console.log("get groups")
    const {user} = req.user;

    try {
        const groups= await Group.find({participants:user});
        if(!groups.length){
            return res.status(404).json({success:false,data:"groups not found"});
        }
        res.status(200).json({success:true,data:groups});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas otrzymania group" });
    }
}

module.exports.addGroup= async (req, res) => {

    console.log("add group")
    const {user,name} = req.body;

    try {
        const group=new Group({name:name,participants:[user]});
        await group.save()
        res.status(200).json({success:true,data:group});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zapisywania groupy." });
    }
}
module.exports.editGroup= async (req, res) => {
    const id=req.params.id;
    console.log("edit group")
    const {newUser,deleteUser,name} = req.body;

    try {
        const group=await Group.findByIdAndUpdate
        (id,{$set:{name:name},$addToSet:{participants:newUser},$pull:{participants:deleteUser}},
            {runValidators:true});
        if(!group)
            return  res.status(404).json({success:false,data:"group not found"});
        res.status(200).json({success:true,data:group});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas editowania groupy." });
    }
}


module.exports.deleteGroup= async (req, res) => {
    const id=req.params.id;
    console.log("delete group")

    try {
        const group=await Group.findByIdAndDelete(id);
        if(!group)
            return  res.status(404).json({success:false,data:"group not found"});
        res.status(200).json({success:true,data:group});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas deletowania groupy." });
    }
}