var express = require('express');
var router = express.Router();
var db = require('./db.js');
var template = require('./template.js')

router.get('/', function (request, response) {        
    db.query(`SELECT * FROM topic`, function(error, topics){        
        db.query(`SELECT * FROM author`, function(error, authors){   
            var title = 'author';            
            var list = template.list(topics);   
            var html = template.html(title, list,
                    `
                   ${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse: collapse;
                        }
                        td{
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p>
                            <input type="text" name="name" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    ``);
            response.send(html);
        });        
    });
});

router.post('/create_process', function(request, response){
    var post = request.body;
    db.query(`
        INSERT INTO author (name, profile) 
            VALUES (?, ?)`,
        [post.name, post.profile],
        function(error, result){
            if(error){
                throw error;
            }else{
                response.redirect(`/author`);
            }
        }
    );
});

router.post('/update_process',function(request, response){
    var post = request.body;
    db.query(`
    UPDATE author 
       SET NAME = ?
         , PROFILE = ?         
     WHERE ID = ?`, 
        [post.name, post.profile, post.id],
        function(error, result){
            if(error){
                throw error;
            }else{
                response.redirect(`/author`);
            }
        }
    );
});

router.post('/delete_process', function(request, response){
    var post = request.body;
    db.query('DELETE FROM topic WHERE author_id = ?',[post.id], function(error1, result){
        if(error1){
            throw error1;
        }
        db.query('DELETE FROM author WHERE id = ?',[post.id], function(error2, result){
            if(error2){
                throw error2;
            }
            response.redirect('/author');
        });
    });    
});


router.get('/update/:authorId', function (request, response) {        
    db.query(`SELECT * FROM topic`, function(error, topics){        
        db.query(`SELECT * FROM author`, function(error2, authors){   
            db.query(`SELECT * FROM author WHERE id=?`,[request.params.authorId], function(error3, author){ 
                var title = 'author';            
                var list = template.list(topics);   
                var html = template.html(title, list,
                        `
                    ${template.authorTable(authors)}
                        <style>
                            table{
                                border-collapse: collapse;
                            }
                            td{
                                border:1px solid black;
                            }
                        </style>
                        <form action="/author/update_process" method="post">
                            <p>
                                <input type="hidden" name="id" value="${author[0].id}">
                            </p>
                            <p>
                                <input type="text" name="name" placeholder="name" value="${author[0].name}">
                            </p>
                            <p>
                                <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                        `,
                        ``);
                response.send(html);
            });              
        });        
    });
});

module.exports=router;