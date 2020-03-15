const rooms=[];
const getRoomNameCountPlayers = (roomName2) => {
    console.log("check getRoomNameCountPlayers from utils")
    console.log(rooms)
    console.log(roomName2)

    roomFound= rooms.find(room => room.name === roomName2);
    console.log(roomFound)
    if(roomFound){
            return roomFound.countPlayers;
    }else{
        return 0;
    }   
}

const createNewRoom = (roomName2) => {
    console.log("create new room")  
    const roomObject={
        name:roomName2,
        countPlayers:1
    };
    rooms.push(roomObject)  
    console.log("new rooms array")
    console.log(rooms)
}

const joinExistingRoom = (roomName2) => {
    console.log("join room")
    roomFound= rooms.find(room => room.name === roomName2);
    roomFound.countPlayers++
    console.log("new rooms array")
    console.log(rooms)
}

const eraseRoomFromArray = (roomName2) => {
    console.log("eraseRoomFromArray start")
    roomFoundIndex= rooms.findIndex(room => room.name === roomName2);
    rooms.splice(roomFoundIndex,1)
    console.log("eraseRoomFromArray- end")
    console.log(rooms)
}
module.exports = {
    getRoomNameCountPlayers,
    createNewRoom,
    joinExistingRoom,
    eraseRoomFromArray,
    rooms
}

