const dbConn = require("./dbConn");

const MIN_ROOM_NAME_LEN = 8;

class room {
    

    // map of {userId, conn}

    #users;



    // list of msg objes

    #msgs;



    #roomId;

    #roomName;

    #validateRoomName () {
        if (!this.#roomName || this.#roomName.length < MIN_ROOM_NAME_LEN) {
            return false;
        }

        return true;
    }

    async createRoom () {

        if (!this.#validateRoomName()) {
            throw "Invalid room name";
        }

        const conn = await dbConn();


        await conn.query(`INSERT INTO rooms(room_name) VALUES('${this.#roomName}')`);

    }


    async logInToRoom () {
        
        if (!this.#validateRoomName()) {
            throw "Invalid room name";
        }

        const conn = await dbConn();


        const res = await conn.query(`SELECT room_id FROM rooms WHERE room_name = '${this.#roomName}'`);


        if (res.rowCount == 0) {
            throw "No room with this name";
        }

        this.#roomId = res.rows[0].room_id;

        return this.#roomId;

    }

    async addUser(new_user) {

    }


    async removeUser(userid) {

    }


    async pushUser(user) {

    }

    
    async popUser(userid) {

    }


    async prodcastMsg(msg) {

    }


    constructor (args) {
        this.#roomName = args.roomname;
    }

}


module.exports = room;