const http = require('http');
const WebSocketServer = require('websocket').server;
const https = require("https");
const express = require("express");


const fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'chat.html');


const roomManeger = require("./myModules/roomManeger");







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




const roommaneger = new roomManeger(websocket);

roommaneger.start();




port_num = process.env.PORT || 3000

// httpsServer.listen(port_num);

app.listen(port_num);

console.log(`on port ${port_num}`);





