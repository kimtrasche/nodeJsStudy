var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
var helmet = require('helmet')

app.use(helmet());

/* 정적파일 위치 등록 */
app.use(express.static('public'));

/*미들웨어 장착*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

/*미들웨어 만들기 */
app.get('*', function(request, reponse, next){
    fs.readdir('./data', function(error, filelist){
        request.list = filelist;
        next();
    });
});

app.use('/', indexRouter);

// router 지정
app.use('/topic', topicRouter);


12300
39280
12000


/* 404 에러 처리*/
app.use(function(req, res, next) {
    res.status(404).send('<h2>Sorry</h2');
});

/* 500 에러 처리*/
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('<h2>내부오류</h2');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
