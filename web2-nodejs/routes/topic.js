var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html')
var template = require('../lib/template.js')
var db = require('../lib/db.js');

router.get('/create', function (request, response){
    db.query(`SELECT * FROM topic`, function(error, topics){
        db.query('SELECT * FROM author', function(error2, authors){
            var title = 'WEB-create';            
            var list = template.list(topics);      
            var html = template.html(title, list,
                `
                <form action="/topic/create_process" method="POST"> 
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <select name="author">
                        ${template.authorSelect(authors)}
                    </select>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `
                ,``    
            );
            response.send(html);
        });                
    });    
});

router.post('/create_process', function(request, response){
    var post = request.body;
    db.query(`
        INSERT INTO topic (title, description, created, author_id) 
            VALUES (?, ?, NOW(), ?)`,
        [post.title, post.description, post.author],
        function(error, result){
            if(error){
                throw error;
            }else{
                response.redirect(`/topic/${result.insertId}`);
            }
        }
    );
});


router.get('/update/:pageId', function(request,response){
    db.query('SELECT * FROM topic', function(error, topics){
        if(error){
            throw error;
        }
        db.query('SELECT * FROM topic WHERE id=?',[request.params.pageId], function(error2, topic){
            if(error2){
                throw error2;
            }
            db.query('SELECT * FROM author', function(error3, authors){
                var list = template.list(topics);
                var title = topic[0].title;
                var description = topic[0].description;
                var html = template.html(title, list, 
                    `
                    <form action="/topic/update_process" method="POST"> 
                    <input type="hidden" name="id" value="${request.params.pageId}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <select name="author">
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </select>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form>
                    `
                    , `<a href="/topic/create">create</a> <a href="/update/${topic[0].id}">update</a>`
                );
                response.send(html);            
            });            
        });
    });    
});

router.post('/update_process',function(request, response){
    var post = request.body;
    db.query(`
    UPDATE topic 
       SET TITLE = ?
         , DESCRIPTION = ?
         , AUTHOR_ID = ?
     WHERE ID = ?`, 
        [post.title, post.description, post.author, post.id],
        function(error, result){
            if(error){
                throw error;
            }else{
                response.redirect(`/topic/${post.id}`);
            }
        }
    );
});


router.post('/delete_process', function(request, response){
    console.log('delete');
    var post = request.body;
    db.query('DELETE FROM topic WHERE ID = ?',[post.id], function(error, result){
        if(error){
            throw error;
        }
        response.redirect('/');
    });
});


router.get('/:pageId', function (request, response, next) {
    db.query(`SELECT * FROM topic`, function(error, topics){ 
        if(error){
            throw error;
        }
        db.query(`SELECT t.id AS id 
                       , t.title
                       , t.description
                       , a.name
                  FROM topic t
                  LEFT JOIN author a
                    ON t.author_id = a.id
                 WHERE t.id=?`,request.params.pageId, function (error2, topic){
            if(error2){
                throw error2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);      
            var sanitizedTitle= sanitizeHtml(title);
            var sanitizedDesc = sanitizeHtml(description);
            var html = template.html(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>
                 <p>${sanitizedDesc}</p> by ${topic[0].name}
                `
                , `<a href="/topic/create">create</a> 
                    <a href="/topic/update/${topic[0].id}">update</a> 
                    <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <input type="submit" value="delete">
                    </form>                           
                    `);
            response.send(html);
        });        
    });
});






module.exports = router;