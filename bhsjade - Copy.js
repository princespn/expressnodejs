var express = require('express');
var mysql = require('mysql');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true})); 

function getMySQLConnection() {
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'nodejs'
	});
}

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/stock_details', function(req, res) {
	var detailList = [];
	
	var connection = getMySQLConnection();
	connection.connect();	
	connection.query('SELECT cost_calculators.linnworks_code,cost_calculators.product_name, purchase_prices.invoice_currency, cost_calculators.category,cost_calculators.supplier,cost_calculators.landed_price_gbp,purchase_prices.purchase_price FROM cost_calculators JOIN purchase_prices ON cost_calculators.linnworks_code = purchase_prices.item_sku', function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		
	  		for (var i = 0; i < rows.length; i++) {

	  			var details = {
					'linnworks_code':rows[i].linnworks_code,
		  			'product_name':rows[i].product_name,
					'category':rows[i].category,
					'supplier':rows[i].supplier,
		  			'invoice_currency':rows[i].invoice_currency,
		  			'purchase_price':rows[i].purchase_price,
					'landed_price_gbp':rows[i].landed_price_gbp
					
		  			
		  		}		  		
		  		detailList.push(details);
	  	}

	  	res.render('cost_details', {"detailList": detailList});
	  	}
	});

	
	connection.end();
	
});

app.get('/signin', function(req, res) {
  res.render('login')
});

app.get('/signup', function(req, res) {
  res.render('registration')
});

app.post('/adduser', function(req, res) {
	var today = new Date();

	var connection = getMySQLConnection();
	connection.connect();
	connection.query("INSERT INTO users(first_name,last_name,username,email,password,city,country)VALUES('"+req.body.first_name+"','"+req.body.last_name+"','"+req.body.username+"','"+req.body.email+"','"+req.body.password+"','"+req.body.city+"','"+req.body.country+"')", function(error, results){
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
   });

});
app.listen(3000, function () {
    console.log('listening on port', 3000);
});