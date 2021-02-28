var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser')
var template = require('./cardTemplate')
var routines = require("./routines")


//Towards the end of the conversation The userDialog array will be used to
//understand the user sentiment/emotion and an appropriate message will then be prepared
//based on that
 var UserDialog = [];
 var bestVendor;
//Usage: UserDialog.push()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var cloudant, mydb;

var state = [
              {Intent:"Get-Password",               Status:false},
              {Intent:"Authentication-Done",        Status:false},
              {Intent:"Awaiting-More-Details",      Status:false},
              {Intent:"Trigger-MRP-Simulation",     Status:false},
              {Intent:"Query-Bom-Error",            Status:false},
              {Intent:"Master-Data-Update",         Status:false},
              {Intent:"Simulation-Completed",       Status:false},
              {Intent:"User-Confirmed-Choice",      Status:false},
              {Intent:"User-Confirmed-Best-Choice", Status:false}
];

var nextAction = [
              {intent:"Get-Password",               phrase:"my password is ****",                 context:"awaiting_password",            lastMessage: "" },
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


app.post("/test", function (request, response) {
/*
      routines.MLGetVendorList(function(err,resp){
      if (err){
        console.log("Error in post call : " + err);
        response.send(err);
        response.end();
      }
      console.log("Success :" + resp);
      response.send(resp);
      response.end();    
    });*/

/*    routines.CreatePO(function(err,resp){
      if (err){
        console.log("Error in post call : " + err);
        response.send(err);
        response.end();
        return;
      }
      console.log("Success :" + resp);
      response.send(resp);
      response.end();    
    });*/

    console.log("Current state of the server:");
    console.log(JSON.stringify(state));
    response.send(state);
    response.end();
    return;   
});

var RPAMasterDataUpdateOk = false;

app.post("/rpabotalert", function (request, response) {
  
      
      if (request.body.SuccessIndicator == true) {
        RPAMasterDataUpdateOk = true;
        console.log("RPA process status : " + RPAMasterDataUpdateOk);
        //call a function from there to inform that this process has completed.        
      }
      console.log("RPA response details:" + request.body.ResponseDetails);

      response.send({});
      response.end();
      return;   
  });
  
  



var setState =  function(intentName){
  //Status = true -> intent completed
  //Status = false -> intent not complete(initialized value)
  var i;
  var found = false;
  for (i=0;i<state.length;i++){  
      if (state[i].Intent == intentName) {
          state[i].Status = true;
          found = true;
          break;
      }  
  }

  if (!found) {
    console.log("setState could not find the intent in question: " + intentName);
    console.log("you may have forgotten to add an intent to the state." + intentName);
  } 

  console.log("finished setState for : " + intentName);
  return;
}

var checkState = function(){

  var i;
  for (i=0;i<state.length;i++){
    if (state[i].Status == false){
      return state[i].Intent;
    }
  console.log("checkState " + i);
  }
return;
}

var getNextAction = function(intentName){
//return a suitable text to indicate what a user should say to move to the next intent
//create a table of context and text 
var i;
  for (i=0;i<nextAction.length;i++){  
      if (nextAction[i].intent == intentName) {
          return nextAction[i];
      }
   console.log("getNextAction " + i)
  }
return;
}

var clearState = function(){
//clear the server's context and intent state
var i;
  for (i=0;i<state.length;i++){  
      
          state[i].Status = false;
  }
  console.log("finished clearState: ");
  return;
}

//webhook from dialogflow
//Actions to perform here:
// 0) parse the input request and determine fields. Use context and or intent to identify what particular routine to be called.
// 1) call watson sentiment analyzer based on user input. get tag/field related to emotions.
// 2) switch case statement for intents. 
// 3) prepare and return the response. 
app.post("/webhook", function (request, response) {


//entryCount++;
//console.log("entryCount=" + entryCount );  
//swtich case statement
//the path decided by intent's value or context  
var requestBody = request.body;
//var currentContext, currentIntent;


const currentContext = requestBody.queryResult.outputContexts[0].name;
const currentIntent = requestBody.queryResult.intent.displayName; 


console.log("#####WEBHOOK Request Received: Body is:");
console.log("Context array is:");
console.log(JSON.stringify(requestBody.queryResult.outputContexts));
console.log("current context is:" + currentContext);
console.log("current intent is:" + currentIntent);



switch(currentIntent) {
//the swith-case block is keyed by the current context in the conversation. 
//Based on this the webhook call will be routed  
  case "Get-Password": //FG21 call here
  case "Awaiting_Password": //FG21 call here
  
      var pwd = requestBody.queryResult.parameters.any;
      console.log("password is :" + pwd);

      //verify password
      if (pwd != "apple") {
        //SET CONTEXT START
        template.simpleResponsePassword.outputContexts = [];
        template.simpleResponsePassword.outputContexts.length = 0;
          var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "awaiting_more_details",
            name: requestBody.session + "/contexts/" + "awaiting_password",
            lifespanCount: 1,
            parameters: null
          };
          template.simpleResponsePassword.outputContexts.push(tempJson);
        ////SET CONTEXT END

        response.send(template.simpleResponsePassword);
        response.end();
      } else {
        //if password is corrrect then send an event as a response to chat bot
        //this event will again trigger webhook form chat bot without needing 
        //any user input. So the control from this section will move to the
        //case "Authentication-Done" seamlessly.
        var followUpEvent = {
          "followupEventInput": {
            "name": "authentication_done",
            "parameters": null,
            "languageCode": "en-US"
          },
          "outputContexts": [
    
          ]
        };
        //mark this intent complete
        setState("Get-Password");
        response.send(followUpEvent);
        response.end();
      }
      //console.log("###BUTTONS" + sampleResponse2.payload.google.richResponse.items[1].basicCard.buttons[0].title);
      
  break;

  case "Authentication-Done":
      console.log("In Authentication-Done");

      //STEP#1 : Call Odata to get Material number
      routines.getMaterialReqFG21(function (err, FioriResp) {

        // ERROR Response

        if (err) {
          console.log("Error returned from Odata Service:" + err);
          msg = "***Material Planner recommends restarting the conversation.***";
          template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
          response.send(template.errorCardTemplate);
          response.end();
          return;   
          
        }  

        // SUCCESS Response
        console.log("@after fiori call in endpoint=webhook");
      
        //prepare response NOW for intent="Awaiting-More-Details"
        if (FioriResp.Mrpavailablequantity < 0) { FioriResp.Mrpavailablequantity *= -1;}
        template.simpleChatResponse.payload.google.richResponse.items = [];
        template.simpleChatResponse.payload.google.richResponse.items.length = 0;
        template.simpleChatResponse.payload.google.richResponse.items.push(
          {"simpleResponse":{"textToSpeech": "We have a shortage of " +  FioriResp.Material 
          + ". We need it by " + FioriResp.Mrpelementavailyorrqmtdate 
          + ". " +   FioriResp.Mrpavailablequantity + " units should be enough"
          }}); 
        
        template.simpleChatResponse.payload.google.richResponse.items.push(
            {"simpleResponse":{"textToSpeech": "My calculations are telling me that these may not reflect the correct stock levels, and can be met with another MRP run with 95% probability. I would suggest we do that before we approve the requisitions for external procurement."  }}); 
  

        //send only the indicative text
        //simpleChatResponse will be sent with next intent

        //SET CONTEXT START
        template.simpleCardTemplate.outputContexts = [];
        template.simpleCardTemplate.outputContexts.length = 0;
        
        var tempJson =   {
          //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "awaiting_more_details",
          name: requestBody.session + "/contexts/" + "awaiting_more_details",
          lifespanCount: 1,
          parameters: null
        };
        template.simpleCardTemplate.outputContexts.push(tempJson);
        ////SET CONTEXT END

        //mark this intent complete
        setState("Authentication-Done");

        response.send(template.simpleCardTemplate);
        response.end();
      });

  break;

  case "Awaiting-More-Details":
      //get more details of the notification sent 
      //SET CONTEXT START
      template.simpleChatResponse.outputContexts = [];
      template.simpleChatResponse.outputContexts.length = 0;
      var tempJson =   {
          //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
          name: requestBody.session + "/contexts/" + "trigger_mrp_simulation",
          lifespanCount: 1,
          parameters: null
      };
      template.simpleChatResponse.outputContexts.push(tempJson);
      ////SET CONTEXT END
        
      //mark this intent complete
      setState("Awaiting-More-Details");
      console.log(template.simpleChatResponse);  
      response.send(template.simpleChatResponse);
      //empty template.simpleChatResponse for future use
      //template.simpleChatResponse.payload.google.richResponse.items = [];
      response.end();
  break;

  case "Trigger-MRP-Simulation":
  //trigger the RPA bot to run simulation
  //respond saying this process has started.
  //Problem: once this completes how will the front-end know that this is complete?
      console.log("in Trigger-MRP-Simulation ")
      //get more details of the notification sent 
      //SET CONTEXT START
      template.simpleChatResponse.outputContexts = [];
      template.simpleChatResponse.outputContexts.length = 0;
      var tempJson =   {
          //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
          name: requestBody.session + "/contexts/" + "query_bom_error",
          lifespanCount: 1,
          parameters: null
      };
      template.simpleChatResponse.outputContexts.push(tempJson);
      ////SET CONTEXT END
      
      template.simpleChatResponse.payload.google.richResponse.items = [];
      template.simpleChatResponse.payload.google.richResponse.items.push(
        {"simpleResponse":{"textToSpeech": "Okay. That has been triggered! "  }}); 

      template.simpleChatResponse.payload.google.richResponse.items.push(
          {"simpleResponse":{"textToSpeech": "Would you like to see error messages on the MRP run from Plant 1010?"  }}); 
  
      //mark this intent complete
      setState("Trigger-MRP-Simulation");
        

      response.send(template.simpleChatResponse);
      //empty template.simpleChatResponse for future use
      //template.simpleChatResponse.payload.google.richResponse.items = [];
      response.end();

  break;

  case "Query-Bom-Error":
  //Dialog: Would you like ot see error from Area 1234.
  console.log("in Query-Bom-Error")  
  //STEP#2 : Call Odata to get message/notification text
        routines.getMRPNotifMsg(function(err,FioriResp) {
          /* ERROR Response */
          if (err) {
            console.log("Error returned from Odata Service:" + err);
            msg = "***Material Planner recommends restarting the conversation.***";
            template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
            response.send(template.errorCardTemplate);
            response.end();
            return;   
          }
          
          var NLPResponseText = FioriResp;
          template.simpleCardTemplateBOM.payload.google.richResponse.items[0].simpleResponse.textToSpeech = NLPResponseText;  
            
        }); 
  
  
        setTimeout(function() {
          console.log('Waiting for Odata...');
        //STEP#3: Now send the consolidated response

        //SET CONTEXT START
        template.simpleCardTemplateBOM.outputContexts = [];
        template.simpleCardTemplateBOM.outputContexts.length = 0;
        var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
            name: requestBody.session + "/contexts/" + "master_data_update",
            lifespanCount: 1,
            parameters: null
        };
        template.simpleCardTemplateBOM.outputContexts.push(tempJson);
        ////SET CONTEXT END
        
        //mark this intent complete
        setState("Query-Bom-Error");
        
        response.send(template.simpleCardTemplateBOM);
        response.end();
  
        }, 2000);
  
    break;
  

    case "Master-Data-Update":
    //trigger master data update as a response to BOM error
        console.log("in Master-Data-Update")
        //get more details of the notification sent 
        routines.UpdateMasterData(function(err,resp){

          if (err) {
            console.log("UpdateMasterData returned error :" + err);
            msg = "***Material Planner recommends restarting the conversation.***";
            template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
            response.send(template.errorCardTemplate);
            response.end();
            return;   
          }

          console.log("UpdateMasterData triggered Chat bot with success: " + resp);
        });


        //SET CONTEXT START
        template.simpleChatResponse.outputContexts = [];
        template.simpleChatResponse.outputContexts.length = 0;
        var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
            name: requestBody.session + "/contexts/" + "simulation_completed",
            lifespanCount: 1,
            parameters: null
        };
        template.simpleChatResponse.outputContexts.push(tempJson);
        ////SET CONTEXT END
        
        template.simpleChatResponse.payload.google.richResponse.items = [];
        template.simpleChatResponse.payload.google.richResponse.items.push(
          {"simpleResponse":{"textToSpeech": "Master data update has been triggered and should be completed in a while."  }}); 
        
          template.simpleChatResponse.payload.google.richResponse.items.push(
            {"simpleResponse":{"textToSpeech": "And I have got the MRP Run results back. Would you like to see how this affects the requisition now ."  }}); 
      
        //mark this intent complete
        setState("Master-Data-Update");
        
        response.send(template.simpleChatResponse);
        response.end();

    
    break;


    case "Simulation-Completed":
    //trigger master data update as a response to BOM error
        console.log("in Simulation-Completed")
        //STEP1: get list of vendors from RPA Bot
        //STEP2: invoke ML algorithm to find out Vendor Scores
        routines.MLGetVendorList(function(err,resp){
          if (err){
            console.log("MLGetVendorList returned error :" + err);
            msg = "***Material Planner recommends restarting the conversation.***";
            template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
            response.send(template.errorCardTemplate);
            response.end();
            return;   
          }

          //save best vendor for future
          bestVendor = resp;          
          console.log("best vendor = " + resp );
        });
        //get more details of the notification sent 
        //SET CONTEXT START
        template.cardSimpleTableTemplate.outputContexts = [];
        template.cardSimpleTableTemplate.outputContexts.length = 0;
        var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
            name: requestBody.session + "/contexts/" + "user_confirmed_choice",
            lifespanCount: 1,
            parameters: null
        };
        template.cardSimpleTableTemplate.outputContexts.push(tempJson);
        ////SET CONTEXT END
        
        //mark this intent complete
        setState("Simulation-Completed");
        
        //this table needs to be populated with RESPONSE FROM 2ND RPA BOT - List of ALL AVAILABLE VENDORS
        response.send(template.cardSimpleTableTemplate);
        //empty template.simpleChatResponse for future use
        //template.simpleChatResponse.payload.google.richResponse.items = [];
        response.end();
        
    break;


    case "User-Confirmed-Choice":
    //user confirms his own choice and inform chat bot about this
    //Here chat bot will invoke the Machine Learning algorithm 
    //and will respons with its own calculated BEST CHOICE

        console.log("in User-Confirmed-Choice")
        //get more details of the notification sent 
        //SET CONTEXT START
        template.simpleChatResponse.outputContexts = [];
        template.simpleChatResponse.outputContexts.length = 0;
        var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
            name: requestBody.session + "/contexts/" + "user_confirmed_best_choice",
            lifespanCount: 1,
            parameters: null
        };
        template.simpleChatResponse.outputContexts.push(tempJson);
        ////SET CONTEXT END
        
        //here if the user selected choice is SAME, then send a different message like "great choice!"
        template.simpleChatResponse.payload.google.richResponse.items = [];
        template.simpleChatResponse.payload.google.richResponse.items.push(
          {"simpleResponse":{"textToSpeech": "I think the first one on the list would be the best choice. It meets the demand forecast from the sales order which was created after we created the MRP run."  }}); 
                
        //mark this intent complete
        setState("User-Confirmed-Choice");
          
        response.send(template.simpleChatResponse);
        //empty template.simpleChatResponse for future use
        //template.simpleChatResponse.payload.google.richResponse.items = [];
        response.end();

    break;
 
    case "User-Confirmed-Best-Choice":
    //User has Nodded wrt best choice. 
    //and the chat can trigger it now to finish the process.
    //chat bot responds with the result.
    //now the sentiment analysis service will be called and a text will be prepared based on that
        console.log("in User-Confirmed-Best-Choice")
        var POId="*";
        routines.CreatePO(function(err,resp){
          if (err) {
            console.log("Error returned from Odata Service:" + err);
            msg = "***Material Planner recommends restarting the conversation.***";
            template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
            response.send(template.errorCardTemplate);
            response.end();
            return;   
          }

            console.log("recieved from Odata:")
            console.log(resp)
            var x = JSON.parse(resp);

            POId = x.d.Po;
            //get more details of the notification sent 
            //SET CONTEXT START
            template.simpleCardTemplatePO.outputContexts = [];
            template.simpleCardTemplatePO.outputContexts.length = 0;
            var tempJson =   {
                //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
                name: requestBody.session + "/contexts/" + "tasks_completed",
                lifespanCount: 1,
                parameters: null
            };
            template.simpleCardTemplatePO.outputContexts.push(tempJson);
            ////SET CONTEXT END
            var tempPOId = POId;
            //template.simpleCardTemplatePO.payload.google.richResponse.items = [];
            template.simpleCardTemplatePO.payload.google.richResponse.items[0].simpleResponse.textToSpeech = 'The PO has been created with ID ' +  POId.split('').join(' ') + '. ';
            template.simpleCardTemplatePO.payload.google.richResponse.items[0].simpleResponse.displayText  = 'The PO has been created with ID ' +  tempPOId + '. ';
            template.simpleCardTemplatePO.payload.google.richResponse.items[1].simpleResponse.textToSpeech = "Is there anything else I may help you with?";
            template.simpleCardTemplatePO.payload.google.richResponse.items[2].basicCard.formattedText = "***PO Id  = " + POId + "***";
            //mark this intent complete
            setState("User-Confirmed-Best-Choice");
            clearState(); //clear the state as user will not throw any more webhooks.
            console.log("state set");  
            response.send(template.simpleCardTemplatePO);
            //empty template.simpleChatResponse for future use
            //template.simpleChatResponse.payload.google.richResponse.items = [];
            response.end();

      }); 
    
    break;

    case "Default Fallback Intent":
    //this intent will be called when the user has made a typo mistake or did not pass on the relevant phrase
    //1) scan the state array and find out where the user was before this issue
    //2) then reply back with a sample text on what a user should type
    //3) set the appropriate context before responding so that the correct intent is triggered
    //CHECKSTATE()
        var i, nextIntent, nextContext, nextPhrase, lastMessage;
        for (i=0;i<state.length;i++){
          if (state[i].Status == false){
            nextIntent = state[i].Intent;
            break;
          }
        }
    //GET NEXT ACTION
        for (i=0;i<nextAction.length;i++){  
          if (nextAction[i].intent == nextIntent) {
              nextContext = nextAction[i].context;
              nextPhrase = nextAction[i].phrase;
              lastMessage = nextAction[i].lastMessage;
              break;
          }
        }

    //    var nextIntent = checkState();
    //    var nextAction = getNextAction(nextIntent);
        console.log("next action is: nextIntent=" + nextIntent + ", nextContext=" + nextContext + ", nextPhrase=" + nextPhrase);

        console.log("in Default Fallback Intent")
        //get more details of the notification sent 
        //SET CONTEXT START
        
        template.simpleFallbackResponse.outputContexts = []
        template.simpleFallbackResponse.outputContexts.length = 0;
        var tempJson =   {
            //name: "projects/mrp-agent-v3/agent/sessions/045c18c3-c070-1c92-ecc9-e30e2c2f2bad/contexts/" + "trigger_mrp",
            name: requestBody.session + "/contexts/" + nextContext,
            lifespanCount: 1,
            parameters: null
        };
        template.simpleFallbackResponse.outputContexts.push(tempJson);
        ////SET CONTEXT END
        
        template.simpleFallbackResponse.payload.google.richResponse.items = [];
        template.simpleFallbackResponse.payload.google.richResponse.items.push(
          {"simpleResponse":{"textToSpeech": "You typed in a phrase incorrectly. This may be a result of a typo error! " + lastMessage + "Below is an example phrase that you could try. "  }}); 
        template.simpleFallbackResponse.payload.google.richResponse.items.push(
            {"simpleResponse":{"textToSpeech": nextPhrase  }}); 
          
        response.send(template.simpleFallbackResponse);
        response.end();

    break;

    case "Refresh-Intent":
    //here you should reset the conversation to the first ever intent by sending appropriate context
          console.log("In Refresh-Intent");
          clearState();
          
            
    break;

    default:
        msg = "Unknown Intent ***" + currentIntent + "*** encountered!";
        template.errorCardTemplate.payload.google.richResponse.items[1].basicCard.formattedText = msg;
        response.send(template.errorCardTemplate);
        response.end();
    
    break;

}

  return;

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



