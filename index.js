const http = require('http');
const WebSocketServer = require('websocket').server;
const https = require("https");
const express = require("express");


const fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'chat.html');


const logIn = require("./myModules/logIn"),
    createRoom = require("./myModules/createRoom"),
    joinRoom = require("./myModules/joinRoom"),
    sendMsg = require("./myModules/sendMsg"),
    handleError = require("./myModules/handleError");





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


// const httpsServer = https.createServer({
//     cert: fs.readFileSync('./cert/cert.pem'),
//     key: fs.readFileSync('./cert/key.pem')
// }, (req, res) => {
//     console.log("there is a req on the server :)");

//     fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
//         if (!err) {
            
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.write(data);
            
//             res.end();

//         } else {

//             console.log(err);
//             res.end();
            
//         }
//     });


// });






const websocket = new WebSocketServer({
    httpServer : app
    // httpServer : httpsServer
});




let conPool = {}; // (name : con)

let roomPool = {}; // (roomId : {name : con})



websocket.on("request", (req) => {
    let conn = req.accept(null, req.origin);

    console.log("new conn :)");


    conn.on("close", () => {
        
        if (conn.username) {
            conPool[conn.username] = null;
        }
        
        console.log("closed !!")
    
    });


    conn.on("onopen", () => console.log("opened !!"));


    
    conn.on('message', (msg) => {

        console.log(msg.utf8Data);

        let msgObj = JSON.parse(msg.utf8Data);
        
        
        if (msgObj.func == "login") {

            logIn(conn, msgObj, conPool).catch((e) => handleError(e, conn));
            
        }

        if (msgObj.func == "createroom") {

            createRoom(conn, roomPool).catch((e) => handleError(e, conn));
            
        }


        if (msgObj.func == "joinroom") {

            joinRoom(conn, msgObj, roomPool).catch((e) => handleError(e, conn));

        }

        
        if (msgObj.func == "sendmsg") {


            sendMsg(conn, msgObj, roomPool).catch((e) => handleError(e, conn));

        }

    });
});




port_num = process.env.PORT || 3000

// httpsServer.listen(port_num);

app.listen(port_num);

console.log(`on port ${port_num}`);





