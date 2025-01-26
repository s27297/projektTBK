require('dotenv').config()
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose')
const timestamping = require("./middleware");
//routers
const userRouter=require('./routers/userRouter');
const postsRouter=require('./routers/postsRouter');
const messagesRouter=require('./routers/messagesRouter');
const groupsRouter=require('./routers/groupsRouter');
const authRouter=require('./auth/authRoutes');
const friendsRouter=require('./routers/friendsRouter');
const eventsRouter=require('./routers/eventsRouter');
const adminRouter=require('./routers/adminRouter');
const otherRouter=require('./routers/otherRouter');
const bannedRouter=require('./routers/bannedRouter');
//cors
const cors=require("cors");

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'],
    methods: '*',
    allowedHeaders: ['Content-Type','Authorization']
}))
//szablony
app.set('view engine','pug');
//midlewars
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(timestamping);
// app.use(addToken)
app.use((req,res,next)=>{
    console.log(req.originalUrl);
    next()
})
app.use('/friends', friendsRouter)
app.use('/events', eventsRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', postsRouter)
app.use('/messages', messagesRouter)
app.use('/groups',groupsRouter)
app.use('/admin',adminRouter)
app.use('/banned',bannedRouter)
app.use('/',otherRouter)


app.get('/',(req,res)=>{
    res.render('welcomePage');
})

app.use((req,res)=>{
    res.status(404).send('404');
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})




const dbURI=process.env.MONGODB_URI

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