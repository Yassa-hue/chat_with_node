const http = require('http');
const WebSocketServer = require('websocket').server;





const app = http.createServer((req, res) => {
    console.log("there is a req on the server :)");
    res.end();
});






const websocket = new WebSocketServer({
    "httpServer" : app,
});




let conPool = {}; // (name : con)

let roomPool = {}; // (roomId : {name : con})

function genRoomId () {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}



websocket.on("request", (req) => {
    let conn = req.accept(null, req.origin);

    console.log("new conn :)");


    conn.on("close", () => console.log("closed !!"));
    conn.on("onopen", () => console.log("opened !!"));


    
    conn.on('message', (msg) => {

        console.log(msg.utf8Data);

        let msgObj = JSON.parse(msg.utf8Data);
        
        
        if (msgObj.func == "login") {
            
            conn.username = msgObj.username;

            conPool[msgObj.username] = conn;

            console.log(`user ${conn.username} logged in :)`);

        }

        if (msgObj.func == "createroom") {
            
            let randomRoomId = genRoomId();

            roomPool[randomRoomId] = {};

            roomPool[randomRoomId][conn.username] = conn;

            let retMsg = `{"type" : "roomid", "roomid" : "${randomRoomId}"}`;

            conn.sendUTF(retMsg);

            console.log(`user ${conn.username} created room : ${randomRoomId}`);

        }


        if (msgObj.func == "joinroom") {
            
            roomPool[msgObj.roomid][conn.username] = conn;

            console.log(`user ${conn.username} joint room : ${msgObj.roomid}`);

        }

        
        if (msgObj.func == "sendmsg") {

            let room = roomPool[msgObj.roomid];

            let chatMsg = `{"type" : "msg", "from" : "${msgObj.from}", "msg": "${msgObj.msg}"}`
            
            for (var c in room) {

                room[c].sendUTF(chatMsg);

            }

        }

    });
});






app.listen(3000);

console.log("on port 3000");





