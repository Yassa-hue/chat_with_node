const { Pool, Client } = require('pg');

async function connectToDb() {
    const client = new Client({
        user: process.env["PGUSER"],
        host: process.env["PGHOST"],
        database: process.env["PGDATABASE"],
        password: process.env["PGPASSWORD"],
        port: process.env["5432"],
        ssl: true
    });
    
    
    await client.connect();
    
    return client;

}

module.exports = connectToDb;