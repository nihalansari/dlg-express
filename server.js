const express = require("express");
const app = express();
const dlg = require('dialogflow-fulfillment'); 
const axios = require('axios');
var bodyParser = require('body-parser')
var template = require('./cardTemplate')
var routines = require("./routines")

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var cloudant, mydb;

app.get('/',(req,res)=>{
	res.send("calls are initiated from chatbot!");
	res.end();
});

//for debugging to know the state of the app at a point in time
app.get("/state", function (request, response) {
    console.log("Current state of the server:");
    console.log(JSON.stringify(state));
    response.send(state);
    response.end();
    return;   
});


//one of the fulfillments from bot
app.post("/queryStores", express.json(), function (request, response) {
	var requestBody = request.body;
	const agent = new dlg.WebhookClient({
		request: request,
		response: response

	});
	  
	var intentMap = new Map();
	intentMap.set('getProductandStore',checkProductStock);
  	agent.handleRequest(intentMap);

  	function checkProductStock(agent){
		agent.add("Response from webhook");
/*	    axios.get( 'https://2886795289-1337-ollie07.environments.katacoda.com/products?productname=' + product + '&suburb=' + suburb)
    		.then(response => {
      		agent.add(response);
    		})
    		.catch((error) => {
        		agent.add("Error! Please try again.");
        		console.log(error);
    		});
*/
  	}  
});




//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});



/*
const currentContext = requestBody.queryResult.outputContexts[0].name;
const currentIntent = requestBody.queryResult.intent.displayName; 
console.log("#####WEBHOOK Request Received: Body is:");
console.log("Context array is:");
console.log(JSON.stringify(requestBody.queryResult.outputContexts));
console.log("current context is:" + currentContext);
console.log("current intent is:" + currentIntent);
*/  
