const connectDB = require('./db/connectDB');
const express = require('express');
const path = require('path');
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
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.get('/' , async(req, res) => {
  data = await allocate();
  return res.render('index' , { RoomId: data })
});
app.get('*',(req, res) => {
  res.json({error: "no such route was found!!!"})
})
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    console.log(room, '-----------------------');
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
      console.log(room);
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
