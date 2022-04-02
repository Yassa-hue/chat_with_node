

async function handleError(error, conn) {
    console.log(error.message);

    let errorMsg = `{"type" : "error", "msg" : "${error.message}"}`;

    conn.sendUTF(errorMsg);
}



module.exports = handleError;