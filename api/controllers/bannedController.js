// const mongoose = require('mongoose');
// const {isObjectIdOrHexString} = require("mongoose");
// const History=require('../schemas/historySchema');
// const {authenticate} = require("../auth/authMiddleware");
// const User = require('../schemas/userSchema');
// const BannedUser = require('../schemas/notAcceptedTextSchema');
const Banned = require("../schemas/notAcceptedTextSchema.js");



module.exports.getBanned= async (req, res) => {
    console.log("get banned")
    try {
        const banned=await Banned.find();
        // console.log(banned);
        if(!banned.length)
            return res.status(404).json({success:false,data:"There are no commits for bun"});
        return res.status(200).json({success:true,data:banned});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania comentow for bun." });
    }
}

module.exports.addBanned= async (req, res) => {
    console.log("add banned")
    console.log(req.user)
    const userAsked=req.user._id.toString()
    const {postId,user,text,commitId}=req.body;
    // console.log(userAsked)
    try {
        const banned=new Banned({
            postId,user,text,userAsked,commitId
        })
        banned.save()
        return res.status(201).json({success:true,data:"message do admina jest wylany"});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania comentow for bun." });
    }
}

module.exports.deleteBanned= async (req, res) => {
    console.log("delete banned")
   const id=req.params.id
    try {
        const banned=await Banned.findByIdAndDelete(id)
        if(!banned)
            return res.status(404).json({success:false,data:"Not found"});

        return res.status(200).json({success:true,data:"usuniete"});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd deletowania commenta for bun." });
    }
}
