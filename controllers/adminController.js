// const mongoose = require('mongoose');
// const {isObjectIdOrHexString} = require("mongoose");
const History=require('../schemas/historySchema.js');
// const {authenticate} = require("../auth/authMiddleware.js");
const User = require('../schemas/userSchema.js');



module.exports.getReport= async (req, res) => {
// console.log(req.user.Admin);
    console.log("get report")
    const date=req.body.date||"2025-01-01T15:17:23.821Z"
    try {
        // return res.status(111).json({})
            const history=await History.find();

        if(!history){
            res.status(404).json({success:false,data:"history is pusta"});
        }
        let answer= {}
       // console.log(history);
        history.map(h=>{
            let action=h.action
            let user=h.user
           //console.log(action);
            if(!answer[user])
                answer[user]= {};

            if(!answer[user][action])
                answer[user][action]=1;
            else
                answer[user][action]+=1;

        })
           return  res.status(200).json({success:true,data:answer});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania reportow." });
    }
}

module.exports.deleteUser= async (req, res) => {
    console.log("delete user")
    const id = req.params.id;
    try {

        const user=await User.findByIdAndUpdate(id,{$set:{isActive:false}});
    if(!user)
        return res.status(404).json({success:true,data:"user is not exist"});
        return  res.status(200).json({success:true,data:user});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd deletowania usera reportow." });
    }
}
module.exports.refereshUser= async (req, res) => {
    console.log("referesh user")
    const id = req.params.id;
    try {

        const user=await User.findByIdAndUpdate(id,{$set:{isActive:true}});
        if(!user)
            return res.status(404).json({success:true,data:"user is not exist"});
        return  res.status(200).json({success:true,data:user});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd deletowania usera reportow." });
    }
}

