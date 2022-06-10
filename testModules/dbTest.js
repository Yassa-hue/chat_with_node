

const getDbPool = require("../myModules/dbConn");



// test db conn

getDbPool().then((pool) => {

    pool.query("SELECT NOW()").then((res) => {
        console.log(res.rows[0]);
    }).catch((e) => console.log(e));

}).catch((er) => console.log(er));