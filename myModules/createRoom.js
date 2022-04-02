


const genRoomId = require("./genRoomId");



async function createRoom(conn, roomPool) {
    if (!conn.username) {

        throw Error("you have to log in");

    }
    
    let randomRoomId = genRoomId();

    roomPool[randomRoomId] = {};

    roomPool[randomRoomId][conn.username] = conn;

    let retMsg = `{"type" : "roomid", "roomid" : "${randomRoomId}"}`;

    conn.sendUTF(retMsg);

    console.log(`user ${conn.username} created room : ${randomRoomId}`);
}


module.exports = createRoom;