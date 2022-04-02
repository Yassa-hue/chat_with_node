


async function typing(conn, msgObj, roomPool) {


    let room = roomPool[msgObj.roomid];

    let chatMsg = `{"type" : "typing", "username" : "${conn.username}"}`
    
    for (var c in room) {

        if (c != conn.username) {

            room[c].sendUTF(chatMsg);

        }

    }


}




module.exports = typing;