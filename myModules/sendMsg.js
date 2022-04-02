


async function sendMsg(conn, msgObj, roomPool) {


    if (!conn.username) {

        throw Error("you have to log in");

    }

    let room = roomPool[msgObj.roomid];

    let chatMsg = `{"type" : "msg", "from" : "${msgObj.from}", "msg": "${msgObj.msg}"}`
    
    for (var c in room) {

        room[c].sendUTF(chatMsg);

    }


}


module.exports = sendMsg;