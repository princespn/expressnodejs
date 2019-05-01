var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true})); 


function mysqlConnection(){
	return mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : '',
		database : 'nodejs'	
		
	});	
}


app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/signin', function(req,res){
 res.render('login')	
});

app.get('/signup', function(req,res){
 res.render('registration')
});

app.get('/mainuser', function(req,res){
	
	
	
	
	
	
});

app.post('/adduser', function(req,res){
	
	
	
	
	
	
});