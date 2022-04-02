const http = require('http');
const WebSocketServer = require('websocket').server;


const fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'chat.html');


const logIn = require("./myModules/logIn"),
    createRoom = require("./myModules/createRoom");





const app = http.createServer((req, res) => {
    console.log("there is a req on the server :)");

    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            
            res.end();

        } else {

            console.log(err);
            res.end();
            
        }
    });


});






const websocket = new WebSocketServer({
    "httpServer" : app,
});




let conPool = {}; // (name : con)

let roomPool = {}; // (roomId : {name : con})



websocket.on("request", (req) => {
    let conn = req.accept(null, req.origin);

    console.log("new conn :)");


    conn.on("close", () => console.log("closed !!"));
    conn.on("onopen", () => console.log("opened !!"));


    
    conn.on('message', (msg) => {

        console.log(msg.utf8Data);

        let msgObj = JSON.parse(msg.utf8Data);
        
        
        try {


            if (msgObj.func == "login") {

                logIn(conn, msgObj, conPool);
                
            }

            if (msgObj.func == "createroom") {

                createRoom(conn, roomPool);
                
            }


            if (msgObj.func == "joinroom") {

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

            
            if (msgObj.func == "sendmsg") {


                if (!conn.username) {

                    throw Error("you have to log in");

                }
                let room = roomPool[msgObj.roomid];

                let chatMsg = `{"type" : "msg", "from" : "${msgObj.from}", "msg": "${msgObj.msg}"}`
                
                for (var c in room) {

                    room[c].sendUTF(chatMsg);

                }

            }

        } catch (e) {
            console.log(e.message);

            let errorMsg = `{"type" : "error", "msg" : "${e.message}"}`;

            conn.sendUTF(errorMsg);
            
        }

    });
});




port_num = process.env.PORT || 3000

app.listen(port_num);

console.log(`on port ${port_num}`);





