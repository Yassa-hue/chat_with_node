

const connectToDb = require("../myModules/dbConn");



// test db conn

connectToDb().then((clnt) => {

    clnt.query("SELECT * FROM users").then((res) => {
        console.log(res.rows);
    }).catch((er) => console.log(er));

}).catch((er) => console.log(er));