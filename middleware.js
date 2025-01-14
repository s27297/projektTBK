

const timestamping=((req,res,next)=>{
    const timestamp=new Date().toISOString()
    req.timestamp=timestamp
    console.log(timestamp);
    // req.body.name.toUpperCase()
    res.append("timestamp",timestamp)
    res.append("timestamp22222",timestamp)
    res.append("timestamp22222",timestamp)
    res.append("timestamp22222",timestamp)
    res.append("timestamp22222",timestamp)
    next()
})
module.exports=timestamping

