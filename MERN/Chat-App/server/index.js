const express=require('express');
const socketio=require('socket.io');
var cors = require('cors')
const http=require('http');
const {addUser,removeUser,getUser,getUsersInRoom}=require('./users.js');
const port=process.env.PORT || 5000;

const router=require('./router');
const { callbackify } = require('util');

const app=express();
app.use(cors());
app.use(router);
const server=http.createServer(app);
const io=socketio(server,{
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});



io.on('connection',(socket)=>{
    
    socket.on('join',({name,room},callback)=>{
        const {error,user}=addUser({id:socket.id,name,room});
        //trigger some response after connection,error handling
        //const error=true;
        if(error){
            return callback({error});
        }
        
        //admin generated messages 
        socket.join(user.room);
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
        //new feature (broadcast:send msg to everyone besides that particular user).
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name}, has joined..`})


       
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
        //now we need to handle messages,events and admin generated messages 
    });

    socket.on('sendMessage',(message,callback)=>{
        //we will take socket.id to get particular user's id
        const user=getUser(socket.id);  
        io.to(user.room).emit('message',{user:user.name,text:message});
        callback();
    });
    
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id); 

        if(user){
            io.to(user.room).emit('message',{user:'admin',text:`${user.name} has left`});
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
    })
});
//now lets generate user generated messages , it is called sendMessage
//and we have to take these messages from front-end



//call middleware
app.use(router);
server.listen(port,()=>{
    console.log(`server started on ${port}`);
});

