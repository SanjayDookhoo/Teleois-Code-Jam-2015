var express = require("express");
var app = express();
var path = require("path");

/*app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});*/

app.use(express.static('public'));

app.listen(3000);
console.log("Its Happening at port 3000 bruh");