const connectToDb = require("./dbConn"),
    jwd = require("jsonwebtoken");

class user {

    #userid = -1
    #username = ""
    #email = ""
    #password = ""

    #dbPool


    #validateEmail(_email) {
        return true;
    }

    #validateUsername(_username) {
        return true;
    }

    #validatePassword(_password) {
        return true;
    }


    async logIn () {
        if (!this.#validateEmail(this.#email)
         || !this.#validatePassword(this.#password)) {
             throw "INVALID data";
         }


        // get user from db

        let res = await (await this.#dbPool.query(`SELECT user_id, username FROM users WHERE email = '${this.#email}' AND password = '${this.#password}'`)).rows;

        if (res.length == 0) {
            throw "Email or password is INVALID";
        }


        

        res = res[0];

        this.#userid = res.user_id
        this.#username = res.username



        // create cridentials

        const token = jwd.sign(res, process.env.ACCESS_TOKEN_SECRET);
        
        return token;

    }

    async signUp () {
        // create user in db

        if (!this.#validateEmail(this.#email)
         || !this.#validatePassword(this.#password)
         || !this.#validateUsername(this.#username)) {
             throw "INVALID data";
         }

        await this.#dbPool.query(`INSERT INTO users(username, email, password) VALUES('${this.#username}', '${this.#email}', '${this.#password}')`);

        // logIn
        const token = await this.logIn();

        return token;
        
    }

    getUserId() {
        return this.#userid;
    }


    constructor (options) {

        this.#username = options.username;
        this.#email = options.email;
        this.#password = options.password;
        
        this.#dbPool = options.dbPool;
    }
}


module.exports = user;