const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const {addUser, removeUser,getUser } = require('./services/chatuser');
const {addOnline, removeOnline, getOnline } = require('./services/onlineuser');

require('./models/User');
const Messages = require('./models/Message');
require('./services/passport');

const { saveMessage } = require('./controllers');


mongoose.connect(keys.mongoURI,{ useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false  });


const app = express();
const server = http.createServer(app);
const io = socketio(server);


// app.use(cors());
app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/testRoutes')(app);
require('./routes/userRoutes')(app);

// saveMessage("latest message ","5f64a46f551ad825fcefb84e","5f7478ca2fe0ce14e8dc255d","9a876ff4-9e62-4afa-a6f2-0e1737487e4e");
// saveMessage("latest latest ","5f7478ca2fe0ce14e8dc255d","5f64a46f551ad825fcefb84e","9a876ff4-9e62-4afa-a6f2-0e1737487e4e");

// Messages.deleteMany({
//     room:"8aaf9394-5966-404c-b6ad-2f0d6b37a7d9"
// }).exec()

io.on('connection',(socket)=>{
    console.log("We have got a new connection!!!");
  
    socket.on('join',({uid})=>{
        user_id = uid;
        addOnline({uid:user_id, skid:socket.id});
        io.emit('updateOnline',getOnline().map(e=>{return {uid:e.uid}}))
  
    });

    socket.on('joinroom',({uid,room,name})=>{
        const {user} = addUser({id:socket.id,uid,room,name});
        socket.join(user.room);
    })

    socket.on('sendRequest',({to})=>{
        setTimeout(()=>{
            socket.broadcast.emit('updateResponse', {
                to
            });
        },3000)
        
    })

    socket.on('acceptResponse',({to})=>{
        setTimeout(()=>{
            socket.broadcast.emit('updateRequestandContact', {
                to
            });
        },3000)
    })

    socket.on('denyResponse',({to})=>{
        setTimeout(()=>{
            socket.broadcast.emit('updateRequest', {
            to
        })},3000)
        
    })

    socket.on('sendMessage',(message)=>{
        console.log(message)
        const user = getUser(message.room,message.to);
        saveMessage(message.message,message.uuid,message.uid,message.to,message.room,message.name);
        if(user){
        io.to(user.room).emit('arrivemessage', {uid:message.uid,message:message.message,name:message.name,gid:message.to});
        }
    })

    socket.on('typing',({uid,to,room})=>{
        const user = getUser(room,uid);
        if(user)
        io.to(user.room).emit('arriveTyping', {uid,name:user.name,gid:to});
    })

    socket.on('delete',({did,room})=>{
        const user = getUser(room,did);
        if(user)
        setTimeout(()=>{
            socket.to(user.room).emit('updateDelete',{
                did,
                droom:room
            })    
        },3000)
        
    })

    socket.on('disconnect',()=>{
        removeUser(socket.id);
        removeOnline(socket.id);
        io.emit('updateOnline',getOnline().map(e=>{return {uid:e.uid}}))
    })
});


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    const path = require('path');
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })

}
const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
});
