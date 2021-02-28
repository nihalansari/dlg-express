const express = require("express");
const app = express();
const dlg = require('dialogflow-fulfillment'); 
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var cloudant, mydb;

app.get('/',(req,res)=>{
	res.send("calls are initiated from chatbot!");
	res.end();
});


//one of the fulfillments from bot
app.post("/queryStores", express.json(), function (request, response) {

	var requestBody = request.body;
	console.log(requestBody);
	//const product = requestBody.queryResult.outputContexts[0].name;
	//const suburb = requestBody.queryResult.intent.displayName;

	const suburb = requestBody.queryResult.parameters['geo-city'].toString();
	const product = requestBody.queryResult.parameters.productname;
	console.log(suburb + "," + product);

	const agent = new dlg.WebhookClient({
		request: request,
		response: response

	});
	  
	var intentMap = new Map();
	intentMap.set('getProductandStore',checkProductStock);
  	agent.handleRequest(intentMap);

  	function checkProductStock(agent){
		const routines = require('./routines');
  		const result = routines.getStockInfo(product,suburb);
		console.log(suburb + "," + product);
		if(result > 0) {
			agent.add(result + " units of " + product + " are available at our " + suburb + " store.");
		} else {
			agent.add("The said product is not available at our " + suburb + " store.");
		}
  	}  
});

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});





