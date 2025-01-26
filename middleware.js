

const timestamping=((req,res,next)=>{
    const timestamp=new Date().toISOString()
    req.timestamp=timestamp
    //console.log(timestamp);
    // req.body.name.toUpperCase()
    res.append("timestamp",timestamp)
    next()
})
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODk1YzdhM2M0ODU3NmIzMzZjZmUzZiIsImlhdCI6MTczNzExOTU0NiwiZXhwIjoxNzM3MTYyNzQ2fQ.9mbVswyNLG_e994oLc_FtMQo1J1FXdPbheCu_sVg2hM
// const addToken=((req,res,next)=>{
    // const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODk1YzdhM2M0ODU3NmIzMzZjZmUzZiIsImlhdCI6MTczNzExOTU0NiwiZXhwIjoxNzM3MTYyNzQ2fQ.9mbVswyNLG_e994oLc_FtMQo1J1FXdPbheCu_sVg2hM"
  // const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGE1YWI4ZTMxZmFiMzc5YTIwNzdhNyIsImlhdCI6MTczNzEyMDQ0MCwiZXhwIjoxNzM3MTYzNjQwfQ.29Xvrvxru-MzuRgZoVnaAgCTsd-vCymvPrigvVruj9o"
  //  req.headers.authorization='Bearer ' + token
    // console.log(req.headers.authorization)
    // next()
// })
module.exports=[timestamping]

