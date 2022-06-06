

class user {

    #userid = -1
    #username = ""
    #email = ""
    #password = ""


    #validateEmail(_email) {
        return _email
    }

    #validateUsername(_email) {
        return _email
    }

    #validatePassword(_email) {
        return _email
    }


    async logIn () {
        // get user from db


        // create cridentials



    }

    async signUp () {
        // create user in db


        // logIn
        this.logIn();


        
    }


    constructor (options) {

        this.#username = options.username;
        this.#email = options.email;
        this.#password = options.password;
        
    }
}