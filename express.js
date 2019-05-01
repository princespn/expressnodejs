var express = require('express');
var mysql = require('mysql');
var app = express();

function getMySQLConnection() {
	return mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : '',
	  database : 'codenew'
	});
}

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/person', function(req, res) {
	var personList = [];
	
	var connection = getMySQLConnection();
	connection.connect();	
	connection.query('SELECT cost_calculators.linnworks_code,cost_calculators.product_name, purchase_prices.invoice_currency, cost_calculators.category,cost_calculators.supplier,cost_calculators.landed_price_gbp,purchase_prices.purchase_price FROM cost_calculators JOIN purchase_prices ON cost_calculators.linnworks_code = purchase_prices.item_sku', function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		
	  		for (var i = 0; i < rows.length; i++) {

	  			var person = {
					'linnworks_code':rows[i].linnworks_code,
		  			'product_name':rows[i].product_name,
					'category':rows[i].category,
					'supplier':rows[i].supplier,
		  			'invoice_currency':rows[i].invoice_currency,
		  			'purchase_price':rows[i].purchase_price,
					'landed_price_gbp':rows[i].landed_price_gbp
					
		  			
		  		}		  		
		  		personList.push(person);
	  	}

	  	res.render('index', {"personList": personList});
	  	}
	});

	
	connection.end();
	
});

/// HTTP Method	: GET

app.get('/person/:id', function(req, res) {

	var connection = getMySQLConnection();
	connection.connect();
	connection.query('SELECT * FROM processed_orders WHERE id = ' + req.params.id, function(err, rows, fields) {
		var person;

	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {
	  		// Check if the result is found or not
	  		if(rows.length==1) {
	  			// Create the object to save the data.
	  			var person = {
		  			'id':rows[i].id,
		  			'order_date':rows[i].order_date,
		  			'currency':rows[i].currency,
		  			'plateform':rows[i].plateform,
		  			'subsource':rows[i].subsource,
					'order_value':rows[i].order_value
		  		}
		  		// render the details.plug page.
		  		res.render('details', {"person": person});
	  		} else {
	  			// render not found page
	  			res.status(404).json({"status_code":404, "status_message": "Not found"});
	  		}
	  	}
	});

	// Close MySQL connection
	connection.end();
});

/// List/Index 	: http://localhost:3000/person
/// Details 	: http://localhost:3000/person/2
///
app.listen(3000, function () {
    console.log('listening on port', 3000);
});