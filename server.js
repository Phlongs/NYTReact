var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Article = require('./models/Article.js');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

var link = 'mongodb://heroku_p04dq6n0:mq9tivrb9nfak9kb9rrdfvma7q@ds129422.mlab.com:29422/heroku_p04dq6n0';
//Local link
var localLink = 'mongodb://localhost/nytreact';

// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect(link);
} else {
  mongoose.connect(localLink);
}

var db = mongoose.connection;

// show any Mongoose errors
db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open', function () {
  console.log('Mongoose connection successful.');
});

app.get('/', function(req, res){
  res.sendFile('./public/index.html');
})

app.get('/api/saved', function(req, res) {

  Article.find({})
    .exec(function(err, doc){

      if(err){
        console.log(err);
      }
      else {
        res.send(doc);
      }
    })
});

app.post('/api/saved', function(req, res){
  var newArticle = new Article(req.body);

  var title = req.body.title;
  var date = req.body.date;
  var url = req.body.url;

  newArticle.save(function(err, doc){
    if(err){
      console.log(err);
    } else {
      res.send(doc._id);
    }
  });
});

app.delete('/api/saved/', function(req, res){

  var url = req.param('url');

  Article.find({"url": url}).remove().exec(function(err, data){
    if(err){
      console.log(err);
    }
    else {
      res.send("Deleted");
    }
  });
});


app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
