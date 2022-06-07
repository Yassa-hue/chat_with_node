const user = require("../myModules/user");


async function testInvalidLogIn(args) {
    try {
        u = new user({email : args.email, password : args.password});
        console.log(`FAILED test invalid login for ${(await u.logIn())}`);
    } catch (e) {
        console.log(`PASSED test invalid login for ${args.email}`);
    }
}


async function testValidLogIn(args) {
    try {
        u = new user({email : args.email, password : args.password});
        console.log(`PASSED test valid login for ${(await u.logIn())}`);
    } catch (e) {
        console.log(`FAILED test valid login for ${args.email} errMsg ${e}`);
    }
}

async function testLogIn () {

    const vldTest = [
            {email : "t1@t.com", password : "12345678"},
            {email : "t2@t.com", password : "12345678"},
            // {email : "t7@t.com", password : "12345678"},
        ],
        inVldTest = [
            {email : "t7@t.com", password : "12345678"},
            {email : "t1@t.com"},
            {password : "12345678"},
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

testLogIn();






async function testInvalidSignUp(args) {
    // to test invalid
}


async function testValidSignUp(args) {
    try {
        u = new user({email : args.email, password : args.password, username : args.username});
        console.log(`PASSED test valid signup for ${(await u.signUp())}`);
    } catch (e) {
        console.log(`FAILED test valid login for ${args.email} errMsg ${e}`);
    }
}

async function testSignUp () {

    const vldTestSignup = [
            {email : "t100@t.com", password : "12345678", username : "test100"},
            {email : "t200@t.com", password : "12345678", username : "test200"},
            // {email : "t7@t.com", password : "12345678"},
        ];


    vldTestSignup.forEach(async function (test) {
        await testValidSignUp(test);
    });
    
}


testSignUp();