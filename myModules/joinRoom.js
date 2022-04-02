


async function joinRoom(conn, msgObj, roomPool) {

    if (!conn.username) {

        throw Error("you have to log in");

    }
    
    if (roomPool[msgObj.roomid] == null) {
        throw Error("invalid room id");
    }
    
    roomPool[msgObj.roomid][conn.username] = conn;
    console.log(`user ${conn.username} joint room : ${msgObj.roomid}`);

    let retMsg = `{"type" : "join", "msg" : "joined room"}`;

    conn.sendUTF(retMsg);

}


module.exports = joinRoom;