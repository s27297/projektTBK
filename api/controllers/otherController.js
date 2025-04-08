// const mongoose = require('mongoose');
// const {isObjectIdOrHexString} = require("mongoose");
const History=require('../schemas/historySchema.js');
// const {authenticate} = require("../auth/authMiddleware");
// const User = require('../schemas/userSchema');



module.exports.getActivity= async (req, res) => {
    console.log("get activity");
    try {
        // return res.status(111).json({})
        const history=await History.find({user:user.req.user.id});

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


module.exports.historyChanges= async (req, res) => {
    console.log("get history changes");

    try {
        // return res.status(111).json({})
        const history=await History.find();

        if(!history){
            res.status(404).json({success:false,data:"history is pusta"});
        }
        let answer= {}
        // console.log(history);
        history.map(h=>{
            if(h.objekt!=="user")
            {
                let action=h.action
                let user=h.user
                //console.log(action);
                if(!answer[user])
                    answer[user]= {};

                if(!answer[user][action])
                    answer[user][action]=1;
                else
                    answer[user][action]+=1;

            }})
        return  res.status(200).json({success:true,data:answer});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania reportow." });
    }
}



