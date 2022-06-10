const user = require("../myModules/user"),
    getDbPool = require("../myModules/dbConn"),
    crypto = require("crypto");


async function testInvalidLogIn(args) {
    try {
        u = new user(args);
        console.error(`FAILED test invalid login for ${(await u.logIn())}`);
    } catch (e) {
        console.log(`PASSED test invalid login for ${args.email}`);
    }
}


async function testValidLogIn(args) {
    try {
        u = new user(args);
        console.log(`PASSED test valid login for ${(await u.logIn())}`);
    } catch (e) {
        console.error(`FAILED test valid login for ${args.email} errMsg ${e}`);
    }
}

async function testLogIn (_dbPool) {

    const vldTest = [
            {email : "t1@t.com", password : "12345678", dbPool : _dbPool},
            {email : "t2@t.com", password : "12345678", dbPool : _dbPool},
            // {email : "t7@t.com", password : "12345678"},
        ],
        inVldTest = [
            {email : "t7@t.com", password : "12345678", dbPool : _dbPool},
            {email : "t1@t.com", dbPool : _dbPool},
            {password : "12345678", dbPool : _dbPool},
            {},
            // {email : "t2@t.com", password : "12345678"}
        ];


    vldTest.forEach(async function (test) {
        await testValidLogIn(test);
    });

    inVldTest.forEach(async function (test) {
        await testInvalidLogIn(test);
    })
    
}







async function testInvalidSignUp(args) {
    // to test invalid
}


async function testValidSignUp(args) {
    try {
        u = new user(args);
        console.log(`PASSED test valid signup for ${(await u.signUp())}`);
    } catch (e) {
        console.error(`FAILED test valid signup for ${args.email} errMsg ${e}`);
    }
}

async function testSignUp (_dbPool) {

    const vldTestSignup = [
            {email : crypto.randomBytes(8).toString("hex") + "@g.com", password : "12345678", username : crypto.randomBytes(15).toString("hex"), dbPool : _dbPool},
            {email : crypto.randomBytes(15).toString("hex") + "@g.com", password : "12345678", username : crypto.randomBytes(8).toString("hex"), dbPool : _dbPool},
            // {email : "t7@t.com", password : "12345678"},
        ];


    vldTestSignup.forEach(async function (test) {
        await testValidSignUp(test);
    });
    
}

getDbPool().then(async function (pool) {
    await testSignUp(pool);
    await testLogIn(pool);
});