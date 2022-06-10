const { Pool, Client } = require('pg');

async function connectToDb() {
    const pool = new Pool({
        user: process.env["PGUSER"],
        host: process.env["PGHOST"],
        database: process.env["PGDATABASE"],
        password: process.env["PGPASSWORD"],
        port: process.env["PGPORT"],
        ssl: {rejectUnauthorized : false}
    });
    
    
    await pool.connect();
    
    return pool;

}

module.exports = connectToDb;