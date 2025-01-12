
const mongoose = require('mongoose');

const User = require('../schemas/userSchema');
const Posts = require('../schemas/postsSchema');
const Comment = require('../schemas/commentSchema');





//new user
module.exports.newPost= async (req, res) => {
// Destrukturyzacja danych z ciała żądania.
    console.log("new Post")
    const { header,text,share} = req.body;
    const user=req.user.id.toString()
    console.log(header,text,user,share);
    try {

        const posts = new Posts(
            {
                "header":header,
                "text":text,
                "user":user,
                "share":share||"All"
            });


        await posts.save();
        res.send("post zapisany pomyślnie.");
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
        else
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

        if(!(req.user.id.toString()===checkOwner.user.toString()||req.user.Admin))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});

        const posts=await Posts.findByIdAndDelete(id)
        if(!posts)
            return res.status(404).json({success:false,data:"post nie znalazony"});
        else
            res.status(200).json({success:true,data:"post usuniety"});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Wystąpił błąd podczas editowania posta." });
    }
}

module.exports.addLike= async (req, res) => {
    const id=req.params.id;
    // const {tryToLike}=req.body
    const tryToLike=req.user.id.toString()
    let like=false

    try{
        const user=await User.findById(tryToLike)
        if(!user)
            return res.status(404).json({success:false,data:"user not found"});
        else{
            const post=await Posts.findById(id)
            if(!post)
                return res.status(404).json({success:false,data:"post nie znalazony"});
            if(tryToLike==post.user)
                return res.status(400).json({success:false,data:"you are the owner of the post"});
            post.likes.map(l=>{if(l===tryToLike){like=true}})
            if(!like) {
                const likedPost=await Posts.findByIdAndUpdate(id,{$push:{likes:tryToLike}})
                if(!likedPost)
                    return res.status(400).json({success: false, data: "nie udalo zrobic like"});
                else
                    return res.status(200).json({success: true, data: "liked"});
            }
            else{
                const disLikedPost=await Posts.findByIdAndUpdate(id,{$pull:{likes:tryToLike}})
                if(!disLikedPost)
                    return res.status(400).json({success: false, data: "nie udalo zrobic disLike"});
                else
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

        if(!(req.user.id.toString()===checkOwner.user.toString()||req.user.Admin))
            return res.status(401).json({success:false,data:"nie jestesz wlascicielem commentarza"});

        const comment=await Comment.findByIdAndDelete(id)
        if(!comment)
            return res.status(404).json({success: false, data: "comment nie udalo sie zdeletowac "})
        else
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
        else
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