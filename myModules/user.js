const connectToDb = require("./dbConn"),
    jwd = require("jsonwebtoken");

class user {

    #userid = -1
    #username = ""
    #email = ""
    #password = ""


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

        const dbConn = await connectToDb();
        let res = await (await dbConn.query(`SELECT user_id, username FROM users WHERE email = '${this.#email}' AND password = '${this.#password}'`)).rows;

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

        const dbConn = await connectToDb();
        await dbConn.query(`INSERT INTO users(username, email, password) VALUES('${this.#username}', '${this.#email}', '${this.#password}')`);

        // logIn
        const token = await this.logIn();

        return token;
        
    }


    constructor (options) {

        this.#username = options.username;
        this.#email = options.email;
        this.#password = options.password;
        
    }
}


module.exports = user;