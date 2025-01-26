
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Message = require('../schemas/messageSchema');
const Posts = require("../schemas/postsSchema");





//get message
module.exports.getMessages= async (req, res) => {

    console.log("get messages")
    const {to} = req.body;
    const from=req.user.id.toString();
    try {
       const messages= await Message.find({from:from,to:to});
       if(!messages.length){
          return res.status(404).json({success:false,data:"messages not found"});
       }
        res.status(200).json({success:true,data:messages});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas otzymuwania message." });
    }
}

module.exports.getMessages= async (req, res) => {

    console.log("get messages users")

    const from=req.user.id.toString();
    try {
        const messages= await Message.find({$or:[{from:from},{to:from}]});
        if(!messages.length){
            return res.status(404).json({success:false,data:"messages not found"});
        }
        res.status(200).json({success:true,data:messages});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas otzymuwania message." });
    }
}

module.exports.addMessage= async (req, res) => {

    console.log("add messages")
    const {to,text} = req.body;
    const from=req.user.id.toString();
    try {
        const message=new Message({from:from,to:to,text:text});
        await message.save()
        res.status(200).json({success:true,data:message});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zapisywania message." });
    }
}
module.exports.editMessage= async (req, res) => {
    const id=req.params.id;
    console.log("edit messages")
    const {text} = req.body;

    try {
        const checkOwner= await Message.findById(id)

        if(!(req.user.id.toString()===checkOwner.from.toString()))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});

        const message=await Message.findByIdAndUpdate(id,{$set:{text:text}},{runValidators:true});
        if(!message)
           return  res.status(404).json({success:false,data:"message not found"});
        message.text=text
        res.status(200).json({success:true,data:message});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas editowania message." });
    }
}


module.exports.deleteMessage= async (req, res) => {
    const id=req.params.id;
    console.log("delete messages")

    try {
        const message=await Message.findByIdAndDelete(id);
        if(!message)
            return  res.status(404).json({success:false,data:"message not found"});
        res.status(200).json({success:true,data:message});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas deletowania message." });
    }
}