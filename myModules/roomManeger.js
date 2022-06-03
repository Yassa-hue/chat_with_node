const handleError = require("./handleError"),
      genRoomId = require("./genRoomId");

class roomManeger {


    /*


        class to manage massenger rooms


    */
    

    #webSocket

    /*
        map of username and conn
    */
    #conPool

    /*
        map of room id and map of username and conn
    */
    #roomPool




    async #logIn (conn, msgObj) {


        if (msgObj.username == null || msgObj.username == "") {
            throw Error("invalid user name");
        }


        if (this.#conPool[msgObj.username]) {
            throw Error("user name is invalid");
        }

        conn.username = msgObj.username;

        this.#conPool[msgObj.username] = conn;

        let retMsg = `{"type" : "login", "msg" : "user logged in", "username" : "${msgObj.username}"}`;

        conn.sendUTF(retMsg);

        console.log(`user ${conn.username} logged in :)`);
        
    }



    async #createRoom(conn) {
        
        if (!conn.username) {

            throw Error("you have to log in");
    
        }
        
        let randomRoomId = genRoomId();
    
        this.#roomPool[randomRoomId] = {};
    
        this.#roomPool[randomRoomId][conn.username] = conn;
    
        let retMsg = `{"type" : "roomid", "roomid" : "${randomRoomId}"}`;
    
        conn.sendUTF(retMsg);
    
        console.log(`user ${conn.username} created room : ${randomRoomId}`);
    }

    
    async #joinRoom(conn, msgObj) {

        if (!conn.username) {

            throw Error("you have to log in");

        }
        
        if (this.#roomPool[msgObj.roomid] == null) {
            throw Error("invalid room id");
        }
        
        this.#roomPool[msgObj.roomid][conn.username] = conn;
        console.log(`user ${conn.username} joint room : ${msgObj.roomid}`);

        let retMsg = `{"type" : "join", "msg" : "joined room"}`;

        conn.sendUTF(retMsg);

    }

    
    async #sendMsg(conn, msgObj) {

        if (!conn.username) {

            throw Error("you have to log in");

        }

        let room = this.#roomPool[msgObj.roomid];

        let chatMsg = `{"type" : "msg", "from" : "${msgObj.from}", "msg": "${msgObj.msg}"}`
        
        for (var c in room) {

            room[c].sendUTF(chatMsg);

        }
    }


    async #typing(conn, msgObj) {
        let room = this.#roomPool[msgObj.roomid];

        let chatMsg = `{"type" : "typing", "username" : "${conn.username}"}`
        
        for (var c in room) {

            if (c != conn.username) {

                room[c].sendUTF(chatMsg);

            }

        }
    }

    






    /*
        this function starts the logic loop
    */
    async start () {
        this.#webSocket.on("request", (req) => {
            let conn = req.accept(null, req.origin);
        
            console.log("new conn :)");
        
        
            conn.on("close", () => {
                
                if (conn.username) {
                    this.#conPool[conn.username] = null;
                }
                
                console.log("closed !!")
            
            });
        
        
            conn.on("onopen", () => console.log("opened !!"));
        
        
            
            conn.on('message', async (msg) => {
        
                // dbConn = await createDbConn();
        
                console.log(msg.utf8Data);
        
                let msgObj = JSON.parse(msg.utf8Data);
                
                
                if (msgObj.func == "login") {
        
                    this.#logIn(conn, msgObj).catch((e) => handleError(e, conn));
                    
                }
        
                if (msgObj.func == "createroom") {
        
                    this.#createRoom(conn).catch((e) => handleError(e, conn));
                    
                }
        
        
                if (msgObj.func == "joinroom") {
        
                    this.#joinRoom(conn, msgObj).catch((e) => handleError(e, conn));
        
                }
        
                
                if (msgObj.func == "sendmsg") {
        
        
                    this.#sendMsg(conn, msgObj).catch((e) => handleError(e, conn));
        
                }
        
        
                if (msgObj.func == "typing") {
        
        
                    this.#typing(conn, msgObj).catch((e) => handleError(e, conn));
        
                }
        
            });
        });
    }
    
    
    
    
    constructor(_webSocket) {
        this.#webSocket = _webSocket;

        this.#conPool = {};
        this.#roomPool = {};
    }




}




module.exports = roomManeger;