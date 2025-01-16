

const timestamping=((req,res,next)=>{
    const timestamp=new Date().toISOString()
    req.timestamp=timestamp
    //console.log(timestamp);
    // req.body.name.toUpperCase()
    res.append("timestamp",timestamp)
    next()
})

const addToken=((req,res,next)=>{
  const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODk1YzdhM2M0ODU3NmIzMzZjZmUzZiIsImlhdCI6MTczNzA1NTM1NCwiZXhwIjoxNzM3MDk4NTU0fQ.6ruZKISEcC3QFdzYVc-g_Dqe_PINaIvuTkYl2_S2ang"
   req.headers.authorization='Bearer ' + token
    console.log(req.headers.authorization)
    next()
})
module.exports=[timestamping,addToken]

