const WebSocketServer = require('websocket').server;

const roomManeger = require("./myModules/roomManeger"),
    httpServer = require("./myModules/httpServerProvider"),
    httpsServer = require("./myModules/httpsServerProvider"),
    dbPool = require("./myModules/dbConn");





const websocket = new WebSocketServer({
    httpServer : httpServer
    // httpServer : httpsServer
});




const roommaneger = new roomManeger(websocket);

roommaneger.start();




port_num = process.env.PORT || 3000

// httpsServer.listen(port_num);

httpServer.listen(port_num);

console.log(`on port ${port_num}`);





