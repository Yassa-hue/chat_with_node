const handleError = require("./handleError"),
      genRoomId = require("./genRoomId"),
      user = require("./user");

class roomManeger {


    /*


        class to manage massenger rooms


    */
    

    #webSocket

    /*
        map of useid and conn
    */
    #conPool

    /*
        map of room id and map of userid and conn
    */
    #roomPool



    /*
        msg obj must have email and password

        return the token
    */
    async #logIn (conn, msgObj) {

        let new_user = new user({email : msgObj.email, password : msgObj.password});
        
        const token = new_user.logIn();

        conn.user = new_user;
        
        conn.userid = new_user.getUserId();

        this.#conPool[new_user.getUserId()] = conn;


        let retMsg = `{"type" : "login", "msg" : "user logged in", "token" : "${token}"}`;

        conn.sendUTF(retMsg);

        console.log(`user ${conn.username} logged in :)`);
        
    }




    /*

        msg obj must have username, email and password

    */

    async #signUp(conn, msgObj) {

        let new_user = new user({
            username : msgObj.username,
            email : msgObj.email,
            password : msgObj.password
        })

        new_user.signUp();

        this.#logIn(conn, msgObj);
    }





    async #createRoom(conn) {
        
        if (!conn.userid) {

            throw Error("you have to log in");
    
        }
        
        let randomRoomId = genRoomId();
    
        this.#roomPool[randomRoomId] = {};
    
        this.#roomPool[randomRoomId][conn.userid] = conn;
    
        let retMsg = `{"type" : "roomid", "roomid" : "${randomRoomId}"}`;
    
        conn.sendUTF(retMsg);
    
        console.log(`user ${conn.userid} created room : ${randomRoomId}`);
    }

    
    async #joinRoom(conn, msgObj) {

        if (!conn.userid) {

            throw Error("you have to log in");

        }
        
        if (this.#roomPool[msgObj.roomid] == null) {
            throw Error("invalid room id");
        }
        
        this.#roomPool[msgObj.roomid][conn.userid] = conn;
        console.log(`user ${conn.userid} joint room : ${msgObj.roomid}`);

        let retMsg = `{"type" : "join", "msg" : "joined room"}`;

        conn.sendUTF(retMsg);

    }

    
    async #sendMsg(conn, msgObj) {

        if (!conn.userid) {

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

            if (c != conn.userid) {

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
                
                if (conn.userid) {
                    this.#conPool[conn.userid] = null;
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