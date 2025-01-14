const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const userRouter=require('./routers/userRouter');
const postsRouter=require('./routers/postsRouter');
const messagesRouter=require('./routers/messagesRouter');
const groupsRouter=require('./routers/groupsRouter');
const authRouter=require('./auth/authRoutes');
const timestamping = require("./middleware");

// app.use((req,res,next)=>{
//     const timestamp=new Date().toISOString()
//     req.timestamp=timestamp
//     console.log(timestamp);
//     req.body.name.toUpperCase()
//     res.append("timestamp",timestamp)
//     next()
// })

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(timestamping);
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', postsRouter)
app.use('/messages', messagesRouter)
app.use('/groups',groupsRouter)

app.get('/',(req,res)=>{
    res.status(200).json({data:'it is siec spolecznosciowa'});
})

app.use((req,res)=>{
    res.status(404).send('404');
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})




const dbURI="mongodb://localhost:27017/userdb"

// Nawiązywanie połączenia z MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Połączono z bazą danych MongoDB");
})
    .catch(err => {
        console.error("Błąd połączenia z MongoDB:", err);
    });
const PORT=process.env.PORT || 5000
const server=app.listen(PORT,()=>{
    const host=server.address().address
    const port=server.address().port
    console.log("Server listening on port at http://"+host+port)
})