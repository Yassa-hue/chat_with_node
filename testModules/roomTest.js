
const room = require("../myModules/roomClass"),
    crp = require("crypto");

async function testValidCreateRoom (args) {
    try {
        const new_room = new room({roomname : args.roomname});
        const ret = await new_room.createRoom();
        console.log(`PASSED create room test : ${ret}`);
    } catch (e) {
        console.log(`FAILED create room test : ${args.roomname} ? ${e}`);
    }
}



async function testInvalidCreateRoom (args) {
    try {
        const new_room = new room({roomname : args.roomname});
        const ret = await new_room.createRoom();
        console.log(`FAILED create room test : ${args.roomname}`);
    } catch (e) {
        console.log(`PASSED create room test : ${e}`);
    }
}




async function testCreateRoom () {
    const validTestCases = [
        {roomname : crp.randomBytes(10).toString("hex")},
        {roomname : crp.randomBytes(8).toString("hex")},
        {roomname : crp.randomBytes(12).toString("hex")},
        {roomname : crp.randomBytes(15).toString("hex")},
    ], invalidTestCases = [
        {},
        {r : "room test inv"},
        {roomname : ""},
        {roomname : "test"}
    ];

    validTestCases.forEach(async function (testcase) {
        await testValidCreateRoom(testcase);
    });

    invalidTestCases.forEach(async function (testcase) {
        await testInvalidCreateRoom(testcase);
    });
}

async function testValidRoomLogIn(args) {
    try {
        const new_room = new room({roomname : args.roomname});
        const ret = await new_room.logInToRoom();
        console.log(`PASSED log in to room test : ${ret}`);
    } catch (e) {
        console.log(`FAILED log in to room test : ${args.roomname} ? ${e}`);
    }
}



async function testInvalidRoomLogIn(args) {
    try {
        const new_room = new room({roomname : args.roomname});
        const ret = await new_room.logInToRoom();
        console.log(`FAILED log in to room test : ${args.roomname}`);
    } catch (e) {
        console.log(`PASSED log in to room test : ${e}`);
    }
}



async function testRoomLogIn() {
    const validTestCases = [
        {roomname : "73436547553c47e1"},
        {roomname : "9cce5afeb3743102e58b94fdd14914"},
        {roomname : "a680b33d64da61ce660bcdc9bf6ba0"}
    ], invalidTestCases = [
        {},
        {r : "room test inv"},
        {roomname : ""},
        {roomname : "test"},
        {roomname : "not found room"}
    ];

    validTestCases.forEach(async function (testcase) {
        await testValidRoomLogIn(testcase);
    });

    invalidTestCases.forEach(async function (testcase) {
        await testInvalidRoomLogIn(testcase);
    });
}



testCreateRoom();


testRoomLogIn();