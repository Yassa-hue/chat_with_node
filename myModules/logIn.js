const jwt = require("jsonwebtoken");


async function logIn(conn, msgObj, conPool, dbConn) {
    
    
    console.log(msgObj);


    const email = msgObj.email,
        password = msgObj.password;




    if (!email || !password) {
        throw Error("invalid email or password");
    }


    
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}';`;
    
    
    res = await dbConn.query(query);


    if (res.rows.length == 0) {
        console.log("can not find");
        throw Error("invalid email or password");
    }


    const currUser = res.rows[0];


    

    conn.curruser = currUser;

    console.log(conn.curruser["username"]);



    conPool[conn.curruser["username"]] = conn;

    const jwtPrivateKey = process.env["JWT_PRIVATE_KEY"];

    const jsonToken = jwt.sign({
        username : currUser.username,
        user_id : currUser.user_id,
        email : currUser.email
    }, jwtPrivateKey);



    let retMsg = `{"type" : "login", "msg" : "user logged in", "jsontoken" : "${jsonToken}"}`;

    conn.sendUTF(retMsg);

    console.log(`user ${conn.curruser.username} logged in :)`);
}



module.exports = logIn;