var express = require('express');
var router = express.Router();
var sanitizeHtml = require('sanitize-html')
var path = require('path');
var template = require('../lib/template.js')
var fs = require('fs');

router.get('/create', function (request, response){
    var title = 'WEB-create';            
    var list = template.list(request.list);      
    var html = template.html(title, list, 
        `
        <form action="/topic/create_process" method="POST"> 
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="descrion"></textarea>
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

router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`,description,'utf8', function(err){            
        response.redirect(`/topic/${title}`);
    });            
});

router.get('/:pageId', function (request, response, next) {
    var list = template.list(request.list);
    var filteredId = path.parse(request.params.pageId).base;//보안
    fs.readFile(`data/${filteredId}`,'utf8', function(err,description){
        if(err){
            next(err);
        }else{
            var title = request.params.pageId;
            var sanitizedTitle= sanitizeHtml(title);
            var sanitizedDesc = sanitizeHtml(description);
            var html = template.html(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDesc}</p>`
                , `<a href="/topic/create">create</a> 
                    <a href="/topic/update/${title}">update</a> 
                    <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                    </form>                           
                    `);
            response.send(html);
        }        
    });
});




router.get('/update/:pageId', function(request,response){
    var list = template.list(request.list);
    var filteredId = path.parse(request.params.pageId).base;//보안
    fs.readFile(`data/${filteredId}`,'utf8', function(err,description){
        var title = request.params.pageId;                    
        var html = template.html(title, list, 
            `
            <form action="/topic/update_process" method="POST"> 
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
                <textarea name="description" placeholder="descrion">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `
            , `<a href="/topic/create">create</a> <a href="/update/${title}">update</a>`
        );
        response.send(html);
    });
});

router.post('/update_process',function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`,description,'utf8', function(err){    
            response.redirect(`/topic/${title}`);     
        });
    });

});

router.post('/delete_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;//보안
    fs.unlink(`data/${filteredId}`, function(err){
        response.redirect('/');
    });
});

module.exports = router;