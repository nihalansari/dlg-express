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

var state = [
              {Intent:"Get-Password",                      Status:false},
              {Intent:"Authentication-Done",           Status:false},
              {Intent:"Awaiting-More-Details",        Status:false},
              {Intent:"Trigger-MRP-Simulation",     Status:false},
              {Intent:"Query-Bom-Error",                  Status:false},
              {Intent:"Master-Data-Update",            Status:false},
              {Intent:"Simulation-Completed",        Status:false},
              {Intent:"User-Confirmed-Choice",      Status:false},
              {Intent:"User-Confirmed-Best-Choice", Status:false}
];

var nextAction = [
              {intent:"Get-Password",               phrase:"my password is ****",   context:"awaiting_password",            lastMessage: "" },
              {intent:"Authentication-Done",        phrase:"",                                    context:"",                             lastMessage: "" },
              {intent:"Awaiting-More-Details",      phrase:"yes please",                          context:"awaiting_more_details",        lastMessage: "You were notified of some messages in your worklist." },
              {intent:"Trigger-MRP-Simulation",     phrase:"lets go ahead with your last suggestion", context:"trigger_mrp_simulation",   lastMessage: "You were given detailso of the message in your worklist." },
              {intent:"Query-Bom-Error",            phrase:"yes please show",                     context:"query_bom_error",              lastMessage: "You triggered MRP run. You were then asked whether you wanted to see message relating to a particular plant." },
              {intent:"Master-Data-Update",         phrase:"Please update Master Data",           context:"master_data_update",           lastMessage: "You were about to command a master data update." },
              {intent:"Simulation-Completed",       phrase:"lets see the results",                context:"simulation_completed",         lastMessage: "You were about to see the list of available vendors for a requisition." },
              {intent:"User-Confirmed-Choice",      phrase:"Second one looks good",               context:"user_confirmed_choice",        lastMessage: "You were show a list of vendors out of which you have to select one." },
              {intent:"User-Confirmed-Best-Choice", phrase:"Lets go for it",                      context:"user_confirmed_best_choice",   lastMessage: "You were advised about select the best possible vendor for a requisition." },
              {intent:"Default Fallback Intent",    phrase:"that is all I needed. Thank you!",    context:"tasks_completed",              lastMessage: "You were supposed to confirm creation of a PO." },
              {intent:"Refresh-Intent",             phrase:"Unexpected error!",                   context:"",                             lastMessage: "" }
];


app.get('/',(req,res)=>{
	res.send("calls are initiated from chatbot!");
	res.end();
});

app.get("/state", function (request, response) {
    console.log("Current state of the server:");
    console.log(JSON.stringify(state));
    response.send(state);
    response.end();
    return;   
});



//step1: parse
//step2: decide which intent need to be served 
//step3: respond with relevant cards 
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
	
	function demo(agent){
		agent.add("Sample response from Webhook");
	}
	var intentMap = new Map();
	intentMap.set('getProductandStore',demo);
	agent.handleRequest(intentMap);


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



