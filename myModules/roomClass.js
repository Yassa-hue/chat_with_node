
const MIN_ROOM_NAME_LEN = 8;

class room {
    

    /*
        map of {userId, user_conn}

        user_conn is a connection that have a user
    */

    #users;



    // list of msg objes

    #msgs;


    #dbPool;


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


        await this.#dbPool.query(`INSERT INTO rooms(room_name) VALUES('${this.#roomName}')`);

    }


    async logInToRoom () {
        
        if (!this.#validateRoomName()) {
            throw "Invalid room name";
        }


        const res = await this.#dbPool.query(`SELECT room_id FROM rooms WHERE room_name = '${this.#roomName}'`);


        if (res.rowCount == 0) {
            throw "No room with this name";
        }

        this.#roomId = res.rows[0].room_id;

        return this.#roomId;

    }

    async addUser(userid) {

        const sql = `INSERT INTO join_room(user_id, room_id, rool, join_at) VALUES(${userid}, ${this.#roomId}, 'member', NOW())`;

        await this.#dbPool.query(sql);

        
    }


    async removeUser(userid) {
        const sql = `DELETE FROM join_room WHERE user_id = ${userid} AND room_id = ${this.#roomId}`;

        await this.#dbPool.query(sql);

        this.popUser(userid);
    }


    pushUser(user) {
        if (this.#users[new_user.getId()]) {
            throw "user is already in the room";
        }


        const sql = `SELECT rool FROM join_room WHERE room_id = ${this.#roomId} AND user_id = ${user.user.getId()}`;

        let res = await this.#dbPool.query(sql);

        if (res.rowCount == 0) {
            throw "user is not in this room";
        }

        user.rool = res.rows[0].rool;

        this.#users[new_user.getId()] = user;
    }

    
    popUser(userid) {
        if (!this.#users[new_user.getId()]) {
            throw "user is not in the room";
        }

        this.#users[userid] = null;
    }


    async prodcastMsg(msg) {
        for (userid in this.#users) {
            this.#users[userid].send(msg);
        }
    }


    constructor (args) {
        this.#roomName = args.roomname;
        this.#dbPool = args.dbPool;
    }

}


module.exports = room;