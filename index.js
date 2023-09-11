const connectDB = require('./db/connectDB');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const { allocate, deallocate } = require("./controller/allocateRoom");
require("dotenv").config();
const peer = ExpressPeerServer(server , {
  debug:true
});

app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , allocate);
app.get('*',(req, res) => {
  res.json({error: "no such route was found!!!"})
})
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        deallocate(room);
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })
})
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port);
    console.log(`Server started on port ${port}`);
  } catch (err) {
    console.log(err);
  }
};
start();

module.exports = app;