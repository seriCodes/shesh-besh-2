const socket = io()
const {token,roomName } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(token+" "+roomName )

socket.on('prepareSocketWithToken',(/*socket*/)=>{
  console.log("roomNameEvent CLIENT ")
  socket.token=token;// first player property init  
 alert("wait for second player to enter")
})
socket.on('roomFullEvent',()=>{
  alert("don't be a pusher!\n The room is full")
})

socket.on('startGameBySendingToServerGameInitDataEvent',(roomName)=>{
  socket.token=token;// second player property init
  
  let initGameObject= initialgame();
  console.log(initGameObject);
  initGameObject[0].roomName=roomName;  
  socket.emit('addOtherPlayerIsWhitePropertyDirectlyToSocket',initGameObject)
  })
  socket.on('addOtherPlayerIsWhitePropertyDirectlyToSocket',(initGameObject)=>{
      socket.isWhite=false;
      socket.emit('copyInitGameObjectAndaddRoomNameToSockets',initGameObject)
    })
socket.on('copyInitGameObjectAndaddRoomNameToSockets',(initGameObject)=>{
  console.log('copyInitGameObjectAndaddRoomNameToSockets. sockets with the game object:')
  socket.gameObject = initGameObject;
  socket.roomName = initGameObject[0].roomName;
  if(socket.isWhite==false){//it's like this because undefined (in the other socket) is falsy also
    socket.gameObject[1].isWhite= socket.isWhite;
    delete socket.isWhite;
  }
  console.log(socket)
  console.log(socket.id)
  console.log('copyInitGameObjectAndaddRoomNameToSockets. end')
  socket.emit('gameInit')
})
socket.on('InitGameDataRendering',()=>{
  let gameData = socket.gameObject[0];
  console.log('InitGameDataRendering start');
  console.log(socket.id)
  console.log(socket.gameObject)
  console.log(gameData.backgammonBoardArray);
  initialBodyElement();
  initialBoardDivDivisions();
  initialBoardAndCheckers(gameData.backgammonBoardArray);
  resetAndCopyBoard(gameData.backgammonBoardArray,gameData.countOfWhiteCheckersEaten,gameData.countOfBlackCheckersEaten);
  copyDice(gameData.diceThrowData.firstThrowResult, gameData.diceThrowData.secondThrowResult );
  checkersEatenVisualised(gameData.countOfWhiteCheckersEaten, gameData.countOfBlackCheckersEaten)
  whosTurnVisualised(gameData.isWhiteTurn);
  console.log(socket);
  alert("let the game begin")
  alert("Move checkers one dice at a time");  
})
socket.on('overwriteGameDataObjecetInOpponentSocket',(gameData)=>{
  console.log('overwriteGameData client start');
  socket.gameObject[0]=gameData;
  socket.emit('middleGameDataRendering',gameData);
  console.log('overwriteGameData client end');
})
socket.on('middleGameDataRendering',(gameData)=>{
  console.log('middleGameDataRendering client start');

   console.log(gameData);
  resetAndCopyBoard(gameData.backgammonBoardArray,gameData.countOfWhiteCheckersEaten,gameData.countOfBlackCheckersEaten);
  copyDice(gameData.diceThrowData.firstThrowResult, gameData.diceThrowData.secondThrowResult );
  checkersEatenVisualised(gameData.countOfWhiteCheckersEaten, gameData.countOfBlackCheckersEaten)
  whosTurnVisualised(gameData.isWhiteTurn);
  console.log(socket); 
  console.log('middleGameDataRendering client end');
})
socket.on('notPossibleToEneterAlert',(gameData)=>{
  socket.emit('notPossibleToEneterAlert',gameData)
})
socket.on('notPossibleToEneterAlertClient',(gameData)=>{
  alert("Not possible to enter for player "+ gameData.isWhiteTurn);
})
socket.on('showDiceOnScreenInAllSockets',(gameData)=>{
  copyDice(gameData.diceThrowData.firstThrowResult, gameData.diceThrowData.secondThrowResult );
})

////!!has to remain at the end of the script!!!
function initSocketJoin(){
  console.log("pre - join working client")
  //add a token or a user name for rating adjustment
  socket.emit('join', { /*token,*/ roomName },/*erase the 'a' variable in index */ console.log("join working client" ),(error) => { 
    if (error) {
        alert(error)
        location.href = '/' // back to join room with the same token
    }
  })
}