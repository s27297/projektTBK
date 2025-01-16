
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Event = require('../schemas/eventSchema');
const Group = require("../schemas/groupSchema");











module.exports.getEvents= async (req, res) => {
    const id = req.params.id;

    console.log("get user events")

    try {
        let events
        if(id)
             events=await Event.find({participants: id});
        else
            events=await Event.find();

        if(!events.length)
            return  res.status(404).json({success:false,data:"events not found"});
        else
            res.status(200).json({success:true,data:events});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania eventow." });
    }
}

module.exports.getEvent= async (req, res) => {
    const id = req.params.id;
    console.log("get event")

    try {
        const event=await Event.findById(id);
        if(event)
            return  res.status(404).json({success:false,data:"event not found"});
        else
            res.status(200).json({success:true,data:event});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd poberania eventa." });
    }
}




module.exports.addEvent= async (req, res) => {
    const creator=req.user.id
    console.log("add event")
    const {date,name,text} = req.body;
    try {
        const event=new Event({name,date,creator,text});
        await event.save()
        res.status(200).json({success:true,data:event});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zapisywania eventa." });
    }
}



module.exports.editEvent= async (req, res) => {
    const id=req.params.id;
    console.log("edit event")
    const {date,name,text} = req.body;
    try {
        const event=await Event.findByIdAndUpdate(id,{$set:{name,date,text}},{runValidators:true});
        if(!event)
            return  res.status(404).json({success:false,data:"event not found"});
        res.status(200).json({success:true,data:"event updated successfully." });
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas updatowania eventa." });
    }
}


module.exports.editParticipants= async (req, res) => {
    const id=req.params.id;
    console.log("edit event participants")
    const {member} = req.body;
    console.log(member)
    try {
        const event= await Event.findById(id);
        if(!event)
            return  res.status(404).json({success:false,data:"event not found"});
        if(Date.now()>event.date)
            return  res.status(200).json({success:false,data:"event juz skonczony"});
        let updatedEvent

        if(!event.participants.includes(member)) {
            updatedEvent = await Event.findByIdAndUpdate(id, {$addToSet: {participants: member}}, {runValidators: true})
        }
        else {
            updatedEvent = await Event.findByIdAndUpdate(id, {$pull: {participants: member}}, {runValidators: true})
        }
        const up=await Event.findById(id)
        res.status(200).json({success:true,data:up });
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zmianu participantow eventa." });
    }
}



module.exports.deleteEvent= async (req, res) => {
    const id=req.params.id;
    console.log("delete event")

    try {
        const event=await Event.findByIdAndDelete(id);
        if(!event)
            return  res.status(404).json({success:false,data:"event not found"});
        res.status(200).json({success:true,data:event});
    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas deletowania eventu." });
    }
}
