var express = require('express');
var app = express();
var mysql = require('mysql');

function getconn(){
	return mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'codenew'
		
	});
}

//set view engine
app.set("view engine","jade");
app.use(express.static('public'));

app.get('/', function (req, res) {
	var listings = [];
	var connection = getconn();
	connection.connect();  
    connection.query('SELECT cost_calculators.linnworks_code,cost_calculators.product_name, purchase_prices.invoice_currency, cost_calculators.category,cost_calculators.supplier,cost_calculators.landed_price_gbp,purchase_prices.purchase_price FROM cost_calculators JOIN purchase_prices ON cost_calculators.linnworks_code = purchase_prices.item_sku', function(err, rows, fields) {
	   if (err){
	  	res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
			for (var i = 0; i < rows.length; i++) {
	  			var listing = {
					'linnworks_code':rows[i].linnworks_code,
		  			'product_name':rows[i].product_name,
					'category':rows[i].category,
					'supplier':rows[i].supplier,
		  			'invoice_currency':rows[i].invoice_currency,
		  			'purchase_price':rows[i].purchase_price,
					'landed_price_gbp':rows[i].landed_price_gbp
					
		  		}		  		
		  		listings.push(listing);
	  	}
		res.render('StudentList', {"studentList": listings});
		
         }
	});	
	connection.end();
});

var server = app.listen(3000, function () {
    console.log('Node server is running..');
});