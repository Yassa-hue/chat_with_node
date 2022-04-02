


async function logIn(conn, msgObj, conPool) {
    if (msgObj.username == null || msgObj.username == "") {
        throw Error("invalid user name");
    }

    conn.username = msgObj.username;

    conPool[msgObj.username] = conn;

    let retMsg = `{"type" : "login", "msg" : "user logged in"}`;

    conn.sendUTF(retMsg);

    console.log(`user ${conn.username} logged in :)`);
}



module.exports = logIn;