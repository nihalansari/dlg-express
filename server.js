const express = require("express");
const app = express();
const dlg = require('dialogflow-fulfillment'); 


var cfenv = require("cfenv");
var bodyParser = require('body-parser')
var template = require('./cardTemplate')
var routines = require("./routines")

 var UserDialog = [];
 var bestVendor;

// parse application/x-www-form-urlencoded
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
app.post("/queryStores", function (request, response) {

var requestBody = request.body;
//for DEBUG
const currentContext = requestBody.queryResult.outputContexts[0].name;
const currentIntent = requestBody.queryResult.intent.displayName; 
console.log("#####WEBHOOK Request Received: Body is:");
console.log("Context array is:");
console.log(JSON.stringify(requestBody.queryResult.outputContexts));
console.log("current context is:" + currentContext);
console.log("current intent is:" + currentIntent);
  
	const agent = new dlg.WebhookClient({
		request: request,
		response: response

	});
	
  
  var intentMap = new Map();
	intentMap.set('getProductandStore',checkProductStock);
  agent.handleRequest(intentMap);
  var product = "kelloggs";
  var suburb = "Manly";

  function checkProductStock(agent){
    // GET onlinestore/products endpoint
    // return. Apply any cards if needed
    axios.get( 'https://2886795289-1337-ollie07.environments.katacoda.com/products?productname=' + product + '&suburb=' + suburb)
    .then(response => {
      agent.add(response);
    })
    .catch((error) => {
        agent.add("Error! Please try again.");
        console.log(error);
    })
    
  }
  

});




/* * * * * * * * * * * * * * * /
/* H O U S E K E E P I N G    */
/* * * * * * * * * * * * * * * /


/* Endpoint to greet and add a new visitor to database.
* Send a POST request to localhost:3000/api/visitors with body
* {
* 	"name": "Bob"
* }
*/
app.post("/api/visitors", function (request, response) {
  var userName = request.body.name;
  var doc = { "name" : userName };
  if(!mydb) {
    console.log("No database.");
    response.send(doc);
    return;
  }
  // insert the username as a document
  mydb.insert(doc, function(err, body, header) {
    if (err) {
      console.log('[mydb.insert] ', err.message);
      response.send("Error");
      return;
    }
    doc._id = body.id;
    response.send(doc);
  });
});




/**
 * Endpoint to get a JSON array of all the visitors in the database
 * REST API example:
 * <code>
 * GET http://localhost:3000/api/visitors
 * </code>
 *
 * Response:
 * [ "Bob", "Jane" ]
 * @return An array of all the visitor names
 */
app.get("/api/visitors", function (request, response) {
  var names = [];
  if(!mydb) {
    response.json(names);
    return;
  }

  mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
      body.rows.forEach(function(row) {
        if(row.doc.name)
          names.push(row.doc.name);
      });
      response.json(names);
    }
  });
});


// load local VCAP configuration  and service credentials
var vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);

// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant');
if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

  // Initialize database with credentials
  if (appEnv.services['cloudantNoSQLDB']) {
    // CF service named 'cloudantNoSQLDB'
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  } else {
     // user-provided service with 'cloudant' in its name
     cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
  }
} else if (process.env.CLOUDANT_URL){
  cloudant = Cloudant(process.env.CLOUDANT_URL);
}
if(cloudant) {
  //database name
  var dbName = 'mydb';

  // Create a new "mydb" database.
  cloudant.db.create(dbName, function(err, data) {
    if(!err) //err if database doesn't already exists
      console.log("Created database: " + dbName);
  });

  // Specify the database we are going to use (mydb)...
  mydb = cloudant.db.use(dbName);
}

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});



