
const mongoose = require('mongoose');

const Group = require('../schemas/groupSchema');
const History = require("../schemas/historySchema");

const User = require('../schemas/userSchema');


//get message
module.exports.getGroups= async (req, res) => {

    console.log("get groups")
    //const {user} = req.user;
    const user=req.body.user||req.user.id;
    const isAdmin=req.user.Admin;
    try {
        let groups
        // if(isAdmin)
        //     groups= await Group.find();
        // else
            groups= await Group.find({participants:user});
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
    const {name} = req.body;
const user=req.user.id;
console.log(user)
    try {
        const group=new Group({name:name,participants:[user]});
        await group.save()
        const history=new History({
            user:req.user.id,
            objekt:"group",
            action:"added group"
        })
        await history.save()
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
    const {name} = req.body;

    try {
        const group=await Group.findByIdAndUpdate
        (id,{$set:{name:name}},
            {runValidators:true});
        if(!group)
            return  res.status(404).json({success:false,data:"group not found"});
        const history=new History({
            user:req.user.id,
            objekt:"group",
            action:"eddited group"
        })
        group.name=name;
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
        const history=new History({
            user:req.user.id,
            objekt:"group",
            action:"deleted group"
        })
        res.status(200).json({success:true,data:group});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas deletowania groupy." });
    }
}


module.exports.deleteMemberFromGroup= async (req, res) => {
    const id=req.params.id;
    console.log("delete group member")
    const {member}=req.body
    try {
        const group=await Group.findByIdAndUpdate(id,{$pull:{participants:member}});
        if(!group)
            return  res.status(404).json({success:false,data:"group not found"});
        res.status(200).json({success:true,data:"member teraz nie w gruppie"});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas usuwania membera z groupy ." });
    }
}

module.exports.addMemberToGroup= async (req, res) => {
    const id=req.params.id;
    console.log("add group member")
    const {member}=req.body
    console.log(member.length)
    console.log(id)
    try {
        if(member.length!==24)
            return res.status(404).json({success:false,data:"id musi byc dlugosci 24 a nie "+member.length});
        const user= await User.findById(member);
        if(!user)
            return  res.status(404).json({success:false,data:"user not found"});
        const group=await Group.findByIdAndUpdate(id,{$addToSet:{participants:member}});
        if(!group)
            return  res.status(404).json({success:false,data:"group not found"});
        res.status(200).json({success:true,data:"memeber zostal dodany"});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas dodawania membera do groupy ." });
    }
}