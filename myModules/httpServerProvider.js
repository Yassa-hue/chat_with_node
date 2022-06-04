

const http = require('http'),
    fs = require('fs');


module.exports = http.createServer((req, res) => {
    console.log("there is a req on the server :)");

    fs.readFile("./chat.html", {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            
            res.end();

        } else {

            console.log(err);
            res.end();
            
        }
    });


});

