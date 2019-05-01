var express = require('express');
var router = express.Router();
var template = require('../lib/template.js')
var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '192.168.56.1',
    user     : 'kt4u',
    password : 'kt4u0512',
    database : 'opentutorials'
});
db.connect();

router.get('/', function (request, response) {    
    db.query(`SELECT * FROM topic`, function(error, topics){        
        var title = 'Welcome';
        var description = 'Hello, Node.js'; 
        var list = template.list(topics);      
        var html = template.html(title, list,
                `<h2>${title}</h2>${description}
                <img src="/images/photo.jpg" style="width:300px;display:block;">`,
                 `<a href="/topic/create">create</a>`);
        response.send(html);
    });
});

module.exports=router;