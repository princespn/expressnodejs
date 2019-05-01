var express = require('express');
var app = express();
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require("body-parser");

function getMySQLConnection(){
	return mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'codenew'
		
	});	
}

app.set('view engine','pug');
app.use(express.static('public'));

app.get('/listing', function(req, res) {
	var listings = [];
	var connection = getMySQLConnection();
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
	  	res.render('admin_listing', {"listings": listings});
	  	}
	});	
	connection.end();
	
});

// HTTP Method	: GET

app.get('/listing/:id', function(req, res) {

	var connection = getMySQLConnection();
	connection.connect();
	connection.query('SELECT * FROM cost_calculators WHERE id = ' + req.params.id, function(err, rows, fields) {
	var listing;
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		if(rows.length==1) {
	  			// Create the object to save the data.
	  			var listing = {
		  			'id':rows[0].id,
		  			'linnworks_code':rows[0].linnworks_code,
		  			'invoice_currency':rows[0].invoice_currency,
		  			'product_name':rows[0].product_name,
		  			'category':rows[0].category,
					'supplier':rows[0].supplier
		  		}
		  		// render the edit.plug page.
		  		res.render('edit', {"listing": listing});
	  		} else {
	  			// render not found page
	  			res.status(404).json({"status_code":404, "status_message": "Not found"});
	  		}
	  	}
	});

	// Close MySQL connection
	connection.end();
});	

app.put('/listing/:id', function(req, res) {
	var connection = getMySQLConnection();
	connection.connect();
	connection.query('UPDATE cost_calculators SET product_name =  " + req.body.product_name  + ",category =  " + req.body.category  + "  WHERE Id = " + req.params.id', function(err, rows, fields) {
	if(err){
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	}
	});	
	connection.end();		
	
});



	
/// List/Index 	: http://localhost:3000/person
/// Details 	: http://localhost:3000/person/2
///
app.listen(3000, function () {
    console.log('listening on port', 3000);
});




