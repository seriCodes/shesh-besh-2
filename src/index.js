console.log("check")
const userRouterAccess = require('./routers/userRouter')
const roomDataUtilsAccess = require('./utils/roomData')
const findUserByToken = require('./utils/userFoundByToken')

const http = require('http')

const path = require('path')
require('./mongoose.js')

const publicDirectoryPath = path.join(__dirname,"../Public")
const express = require('express');
const app = express();
const socketio = require('socket.io')
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT;

app.use(express.json());
app.use(express.static(publicDirectoryPath))
app.use(userRouterAccess)

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('socketCheck', () => {
        console.log('The button click is ALWAYS second in the server!')        
      //  console.log(socket);
        socket.broadcast.emit ('socketCheck')
        })
    
        socket.on('join', ({ roomName },a, callback) => {
            console.log("join working server "+ roomName)          
            //indifferent between getting all the data of the room at once and getting it in 1 property like that:
           console.log(roomDataUtilsAccess.getRoomNameCountPlayers(roomName))
            switch(roomDataUtilsAccess.getRoomNameCountPlayers(roomName)){
                case 0: 
                socket.join(roomName)
                socket.emit('prepareSocketWithToken',/*socket,*/ roomDataUtilsAccess.createNewRoom(roomName))
                break;
                case 1: 
                socket.test=2
                console.log(socket)
                socket.join(roomName)
                roomDataUtilsAccess.joinExistingRoom(roomName)     
                socket.emit('startGameBySendingToServerGameInitDataEvent',roomName)
                break;
                case 2: 
                socket.emit('roomFullEvent')
                break;
            }
  })
 
  socket.on('addOtherPlayerIsWhitePropertyDirectlyToSocket',(initGameObject)=>{
    socket.broadcast.to(initGameObject[0].roomName).emit('addOtherPlayerIsWhitePropertyDirectlyToSocket',initGameObject)

  })

  socket.on('copyInitGameObjectAndaddRoomNameToSockets',(initGameObject)=>{
    io.to(initGameObject[0].roomName).emit('copyInitGameObjectAndaddRoomNameToSockets',initGameObject )

  })

  socket.on('gameInit',()=>{
    console.log('gameInit start');
    socket.emit('InitGameDataRendering')
    console.log('gameInit end');
  })

  socket.on('overwriteGameDataObjecetInOpponentSocket',(gameData)=>{
    console.log('overwriteGameData server start');
   socket.broadcast.to(gameData.roomName).emit('overwriteGameDataObjecetInOpponentSocket',gameData)
    console.log('overwriteGameData server end');
  })
  socket.on('middleGameDataRendering',(gameData)=>{
    console.log('middleGameDataRendering server start');
     io.to(gameData.roomName).emit('middleGameDataRendering',gameData)
    console.log('middleGameDataRendering server end');
  })
  socket.on('notPossibleToEneterAlert',(gameData)=>{
    console.log('notPossibleToEneterAlert server start');
     io.to(gameData.roomName).emit('notPossibleToEneterAlertClient',gameData)
    console.log('notPossibleToEneterAlert server end');
  })
  socket.on('showDiceOnScreen',(gameData)=>{
    console.log('showDiceOnScreen server start');
     io.to(gameData.roomName).emit('showDiceOnScreenInAllSockets',gameData)
    console.log('showDiceOnScreen server end');
  })
  socket.on('rateWinnerUp',async (token)=>{
    console.log(token);

    console.log('rateWinnerUp server start');
    const user = await findUserByToken(token);
    console.log('user found in index');
    console.log(user.name)
    console.log('user pre-rating');
    console.log(user.rating);
     user.rating = user.rating+1;
     console.log('user post-rating');
    console.log(user.rating);
    user.save();

  })

  socket.on('eraseRoom',(roomName)=>{
    console.log(roomName);
    console.log('eraseRoom server start');
    console.log('rooms pre-erase');
    console.log(roomDataUtilsAccess.rooms)
    roomDataUtilsAccess.eraseRoomFromArray(roomName);
   // console.log('eraseRoom found in index');
   console.log('rooms post-erase');
    console.log(roomDataUtilsAccess.rooms)
  })
  socket.emit('eraseRoom',socket.roomName);//חושב-שמיותר 
})
   
server.listen(port,()=>console.log("Server is up on port "+port))

