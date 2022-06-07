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