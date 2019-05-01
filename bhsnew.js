var express = require('express');
var app = express();
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({extended:true})); 

function getMySQLConnection(){
	return mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'codenew'
		
	});	
}


app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/week-sales', function (req, res) {
var detailList = [];
var con = getMySQLConnection();
	con.connect();
	con.query('SELECT inventory_codes.linnworks_code,inventory_codes.product_name,inventory_codes.category, purchase_prices.invoice_currency,cost_calculators.supplier,cost_calculators.landed_price_gbp,cost_calculators.landed_price_eur,purchase_prices.purchase_price FROM cost_calculators JOIN purchase_prices ON cost_calculators.linnworks_code = purchase_prices.item_sku JOIN inventory_codes ON cost_calculators.linnworks_code = inventory_codes.linnworks_code', function(err, rows, fields) {
	
	//con.query('SELECT cost_calculators.linnworks_code,cost_calculators.product_name, purchase_prices.invoice_currency, cost_calculators.category,cost_calculators.supplier,cost_calculators.landed_price_gbp,purchase_prices.purchase_price FROM cost_calculators JOIN purchase_prices ON cost_calculators.linnworks_code = purchase_prices.item_sku', function(err, rows, fields) {
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
					'landed_price_gbp':rows[i].landed_price_gbp,
					'landed_price_eur':rows[i].landed_price_eur
			}		  		
		  		detailList.push(details);
			}
			res.render('purchase_details', {"detailList": detailList});
	  	}
   
});
con.end();
});

var server = app.listen(3000, function () {   
 console.log('listening on port', 3000);
})