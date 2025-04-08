
const mongoose = require('mongoose');

const User = require('../schemas/userSchema.js');
const Posts = require('../schemas/postsSchema.js');
const Comment = require('../schemas/commentSchema.js');
const History = require("../schemas/historySchema.js");





module.exports.getPosts= async (req, res) => {
// Destrukturyzacja danych z ciała żądania.
    console.log("get Post")
    const user=req.query.user||req.user._id
    const isAdmin=req.user.Admin;
    console.log(user)
    console.log("Posty usera   "+user)

    try {
        let posts
        posts = await Posts.find({user:user})
        if(!posts.length)
            return res.status(404).json({success:false,data:"posts not found"});
        res.status(200).json({success:true,data:posts});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas pobierania posta." });
    }
}

module.exports.newPost= async (req, res) => {
// Destrukturyzacja danych z ciała żądania.
    console.log("new Post")
    const { header,text,share} = req.body;
    const user=req.user.id
    console.log(header,text,user,share);
    try {

        const posts = new Posts(
            {
                "header":header,
                "text":text,
                "user":user,
                "share":share||"All"
            });

        console.log(posts)
        await posts.save();
        const history=new History({
            user:user,
            objekt:"post",
            action:"created post"
        })
        await history.save()
        res.status(200).json({success:true,data:"post zapisany pomyślnie."});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas zapisywania posta." });
    }
}


//edit post
module.exports.editPost= async (req, res) => {

    const id=req.params.id;
    console.log("edit Post")
    const { header,text,share} = req.body;
    console.log(id,header,text,share);
    try {
        const checkOwner= await Posts.findById(id)

        if(!(req.user.id.toString()===checkOwner.user.toString()))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});

        const posts=await Posts.findByIdAndUpdate(id,{$set:{"header":header,"text":text,"share":share}},{runValidators:true})
        if(!posts)
            return res.status(404).json({success:false,data:"post nie znalazony"});
        const history=new History({
            user:req.user.id,
            objekt:"post",
            action:"changed post",
        })
        await history.save()
        res.status(200).json({success:true,data:posts});
    } catch (err) {
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas editowania posta." });
    }
}

module.exports.deletePost= async (req, res) => {
    const id=req.params.id;
    console.log("delete Post")
    try {
        const checkOwner= await Posts.findById(id)
        if(!checkOwner)
            return res.status(404).json({success:false,data:"post nie znalazony"});
        if(!(req.user.id.toString()===checkOwner.user.toString()||req.user.Admin))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem posta"});

        const posts=await Posts.findByIdAndDelete(id)

        const history=new History({
            user:req.user.id,
            objekt:"post",
            action:"deleted post"
        })
        await history.save()
        res.status(200).json({success:true,data:"post usuniety"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas editowania posta." });
    }
}

module.exports.addLike= async (req, res) => {
    const id=req.params.id;
    // const {tryToLike}=req.body
    const tryToLike=req.user._id
    console.log("1324"+req.user._id)
    let like=false

    try{
        const user=await User.findById(tryToLike)
        if(!user)
            return res.status(404).json({success:false,data:"user not found"});
        else{
            const post=await Posts.findById(id)
            if(!post)
                return res.status(404).json({success:false,data:"post nie znalazony"});
            console.log("try     "+tryToLike)
            console.log("post   "+post.user)

            if(tryToLike.toString()===post.user.toString())
                return res.status(400).json({success:false,data:"you are the owner of the post"});
            post.likes.map(l=>{if(l.toString()===tryToLike.toString()){like=true}})
            if(!like) {
                const likedPost=await Posts.findByIdAndUpdate(id,{$push:{likes:tryToLike}})
                if(!likedPost)
                    return res.status(400).json({success: false, data: "nie udalo zrobic like"});
                const history=new History({
                    user:req.user.id,
                    objekt:"post",
                    action:"liked post"
                })
                await history.save()
                return res.status(200).json({success: true, data: "liked"});
            }
            else{
                const disLikedPost=await Posts.findByIdAndUpdate(id,{$pull:{likes:tryToLike}})
                if(!disLikedPost)
                    return res.status(400).json({success: false, data: "nie udalo zrobic disLike"});
                const history=new History({
                    user:req.user.id,
                    objekt:"post",
                    action:"disliked post"
                })
                await history.save()
                return res.status(200).json({success: true, data: "disliked"});
            }
        }
        }catch(err){
        console.log(err)
        return res.status(500).json({success:false,data:"wystapil blad podczas likowania posta"});
    }
}


module.exports.sharePost= async (req, res) => {
    console.log("share Post")
    const id=req.params.id;
    const {share}=req.body
    try{
        const post=await Posts.findByIdAndUpdate(id,{$set:{share:share}},{runValidators:true})
        if(!post)
            return res.status(404).json({success:false,data:"post nie znalazony"});
        else
            return res.status(200).json({success:true,data:"post udostepniny do gruppy: "+share})

    }catch(err){
        console.log(err)
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        return res.status(500).json({success:false,data:"wystapil blad podczas likowania posta"});
    }
}



module.exports.addComment= async (req, res) => {
   console.log("addComment")
    const id=req.params.id;
    const {text,tagged}=req.body
    const user=req.user.id.toString()
    try{
        const post=Posts.findById(id)
        if(!post)
            return res.status(404).json({success:false,data:"post nie znalazony"});
        else {
           const comment=new Comment({post:id,text:text,tagged:tagged,user:user});
           await comment.save()
            const history=new History({
                user:req.user.id,
                objekt:"post",
                action:"added comment"
            })
            await history.save()
            return res.status(200).json({success: true, data: "comment zapisany pomyslne: "})
        }
    }catch(err){
        console.log(err)
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        return res.status(500).json({success:false,data:"wystapil blad podczas dodawania commentarza"});
    }
}

module.exports.deleteComment= async (req, res) => {
    const id=req.params.id;
    try{
        const checkOwner= await Comment.findById(id)
        if(!checkOwner)
            return res.status(404).json({success: false, data: "comment not found "})
        if(!(req.user.id.toString()===checkOwner.user.toString()||req.user.Admin))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});

        const comment=await Comment.findByIdAndDelete(id)
        if(!comment)
            return res.status(404).json({success: false, data: "comment nie udalo sie zdeletowac "})
        const history=new History({
            user:req.user.id,
            objekt:"post",
            action:"deleted comment"
        })
        await history.save()
        return res.status(200).json({success: true, data: "comment deleted pomyslne: "})

    }catch(err){
        console.log(err)
        return res.status(500).json({success:false,data:"wystapil blad podczas deletowania commentarza"});
    }
}

module.exports.editComment= async (req, res) => {
    const id=req.params.id;
    const {text}=req.body
    try{
        const checkOwner= await Comment.findById(id)

        if(req.user.id.toString()!==checkOwner.user.toString())
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});
        const comment=await Comment.findByIdAndUpdate(id,{$set:{text:text}},{runValidators:true})
        if(!comment)
            return res.status(404).json({success: true, data: "comment nie udalo sie zeditowac "})
        const history=new History({
            user:req.user.id,
            objekt:"post",
            action:"eddited comment"
        })
        await history.save()
        return res.status(200).json({success: true, data: "comment edieted pomyslne: "})

    }catch(err){
        console.log(err)
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        return res.status(500).json({success:false,data:"wystapil blad podczas editowania commentarza"});
    }
}


module.exports.getComments= async (req, res) => {
    const id=req.params.id;
    // const {text}=req.body
    try{
        // const checkOwner= await Comment.findById(id)
//a

        const comments=await Comment.find({post:id})
        if(!comments||!comments.length)
            return res.status(404).json({success: false, data: "comment nie udalo sie znalezć "})

        return res.status(200).json({success: true, data: comments})

    }catch(err){
        console.log(err)
        if(err.name === 'ValidationError'){
            const messages =Object.values(err.errors).map(value => value.message)
            return res.status(400).json({success:false,errors:messages});
        }
        return res.status(500).json({success:false,data:"wystapil blad podczas pobierania commentarza"});
    }
}