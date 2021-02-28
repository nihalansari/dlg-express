var template = require('./cardTemplate')
var axios = require('axios');

var Qty;

/*consumes Fiori Odata destination*/
exports.getMaterialReqFG21 = function (callback) {

  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";


    var request = require("request");

    var options = { 
      method: 'GET',
      //url: "http://9.51.193.25:8001/sap/opu/odata/sap/ZDSS_MAT_NOTIF_SRV/notifSet(Material='FG21')?$format=json",
      //use a public ip address instead so that IBM vpn is not needed
      url: "https://169.47.160.212:44301/sap/opu/odata/sap/ZDSS_MAT_NOTIF_SRV/notifSet(Material='FG21')?$format=json",
      qs: { '$format': 'json' },
      headers: 
          { 
          Authorization: 'Basic TkFOU0FSSTpAQ29udHJhMDA=' 
          } 
    };
    
    request(options, function (error, response, body) {
    
    /*ERROR Block*/
      if (error) { 
        callback(error); 
        return; 
      }
    
    /*SUCCESS Block*/
    console.log("read the following data from FIORI MRP1 URL:");
    console.log(body);
      
    x = JSON.parse(body);
      
      
    var TempResponse = {
        Material:"",
        Mrpelementavailyorrqmtdate:"",
        Mrpavailablequantity:"",
        Materialbaseunit:""
    };
      
    TempResponse.Material = x.d.Material;
    TempResponse.Materialbaseunit = x.d.Materialbaseunit;
    TempResponse.Mrpavailablequantity = x.d.Mrpavailablequantity;

    //save Quantity for use by Create PO Service
    Qty = x.d.Mrpavailablequantity;
    //convert to positive
    if (Qty < 0) { Qty *= -1; } 
    
    //extract the date out from xml date
    TempResponse.Mrpelementavailyorrqmtdate = x.d.Mrpelementavailyorrqmtdate.substring(
       x.d.Mrpelementavailyorrqmtdate.lastIndexOf("/DATE(") + 7, 
       x.d.Mrpelementavailyorrqmtdate.lastIndexOf(")/")
    );
    var dateVal =x.d.Mrpelementavailyorrqmtdate;
    var date = new Date( parseFloat( dateVal.substr(6 )));
    //TempResponse.Mrpelementavailyorrqmtdate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    TempResponse.Mrpelementavailyorrqmtdate = month[(date.getMonth())] + " " + date.getDate() + " " + date.getFullYear();
    
  
    
    //console.log("TempResponse");
    //console.log(TempResponse);
    callback(null,TempResponse);
    });

    
};

/* consume watson API */
exports.getWatsonSentiment = function (callback) {
    //call the watson sentiment analysis API
    
    /* run sentiment analysis for each text the user types. Below is an example from our story
          any updates since i was away. 
          please help me with that.
          looks like they were missed from recent bom additions. 
          please update master data. 
          splendid! just in time before i get another set of escalations. 
          the second one looks good. 
          lets go for it.
          that is all i needed. thanks.
    */


    var request = require("request");
    
    var options = { method: 'POST',
      url: 'https://gateway-syd.watsonplatform.net/natural-language-understanding/api/v1/analyze',
      qs: { version: '2018-11-16' },
      headers: 
       { 
         'cache-control': 'no-cache',
         Authorization: 'Basic YXBpa2V5OnBZcHZKVkVzajVHWE8yVW5FZ1J4UEZ3VjV0dzVvZ2VseWRoRlZXM2xwMndS',
         'Content-Type': 'application/json' },
      body: 
       { text: 'quick brown fox jumps over the lazy dog',
         features: 
          { sentiment: {},
            categories: {},
            concepts: {},
            entities: {},
            keywords: {} } },
      json: true };
    
    request(options, function (error, resp, body) {
    
      /*ERROR Block*/
      if (error) { 
        callback(error); 
        return; 
      }
    
      /*SUCCESS Block*/
      console.log("read the following data Watson sentiment analysis:");
      console.log(body);
      
      x = JSON.parse(body);
      //return sentiment analysis Json object
      callback(null,x);
    
    });
}

exports.getMRPNotifMsg = function (callback) {
    var request = require("request");
    
    var options = { 
      method: 'GET',
      url: "https://169.47.160.212:44301/sap/opu/odata/sap/ZDSS_NOTIFICATION_SRV/NotifSet('En')?$format=json",
      qs: { '$format': 'json' },
      headers: 
          { 
          Authorization: 'Basic TkFOU0FSSTpAQ29udHJhMDA=' 
          } 
    };

    request(options, function (error, response, body) {
        /*ERROR Block*/
        if (error) { 
          console.log("Error at getMRPNotifMsg");
          console.log(error);
          
          callback(error); 
          return; 
        }

        /*SUCCESS Block*/

        console.log("read the following data from FIORI MRP1 URL:");
        console.log(body);
        
        x = JSON.parse(body);
        
        var TempResponse = x.d.NotifMsg;  

        callback(null,TempResponse);
    });
}

GetBearerToken = function(callback){

  var request = require("request");

  var options = { method: 'GET',
    url: 'https://us-south.ml.cloud.ibm.com/v3/identity/token',
    headers: 
     { Authorization: 'Basic YWM3YTI2ZDMtOWUwMC00ZDk3LWI2YTctNGIwMGQyNWVhNDdhOjMwYjdjYTAxLTg3OTEtNDdjYy04NDNjLWE4NWVkMWVhYzU1NQ==' } };
  
  request(options, function (error, response, body) {
    if (error) {
      err = error;
      console.log("Error during GetBearerToken: " + error);
      throw new Error(error);
      return;
    }

    x = JSON.parse(body)
    callback(null,"Bearer " + x.token);
  });
  
  return;
}

exports.MLGetCluster = function (callback) {
  var methodName = "MLGetCluster";
  
  console.log("In MLGetCluster");
    
  GetBearerToken(function(err,response){   

    if (err) {
      console.log("Error during GetBearerToken: " + err);
      throw new Error(err);
    }
  
    //console.log(response);
    var BearerToken = response;
    var request = require("request");

    var options = { method: 'POST',
    url: 'https://us-south.ml.cloud.ibm.com/v3/wml_instances/22c650f8-de66-4501-b5b8-e37d23cd5b12/deployments/c6d4cdfc-82d3-42f1-aa90-9e57da0462d3/online',
    headers: 
    { 
     Connection: 'keep-alive',
     Host: 'us-south.ml.cloud.ibm.com',
     Authorization: BearerToken,
     'Content-Type': 'application/json' },
    body: 
    { fields: 
        [ 'MATERIAL',
          'LEADTIME',
          'PRICE',
          'SCORE_QUANT1',
          'SCORE_TIME1',
          'SCORE_AUDIT1' ],
      values: [ [ 'TG12', 2, 10, 0, 0, 0 ] ] },
    json: true };

  request(options, function (error, response, body) {
      /*ERROR Block*/
      if (error) { 
        console.log("Error at :" + methodName);
        console.log(error);
        callback(error); 
        return; 
      }

      /*SUCCESS Block*/
      console.log("read the following data in " + methodName + ":");
      //console.log(JSON.stringify(body));
      
      callback(null,body);
  });
});
 return;
}

exports.MLGetVendorList = function (callback) {
  var methodName = "MLGetVendorList";
  
  console.log("In " + methodName);


GetBearerToken(function(err,response){   

  if (err) {
    console.log("Error during GetBearerToken: " + err);
    throw new Error(err);
  }

  //console.log(response);
  var BearerToken = response;
  var request = require("request");

  var options = { method: 'POST',
  url: 'https://us-south.ml.cloud.ibm.com/v3/wml_instances/22c650f8-de66-4501-b5b8-e37d23cd5b12/deployments/51a21724-1ab9-4708-9903-5b6b15952ae0/online',
  headers: 
  { 
   Connection: 'keep-alive',
   Host: 'us-south.ml.cloud.ibm.com',
   Authorization: BearerToken,
   'Content-Type': 'application/json' },
  body: { fields: [ 'Cluster' ], values: [ [ 1 ] ] },
  json: true };

request(options, function (error, response, body) {
    /*ERROR Block*/
    if (error) { 
      console.log("Error at :" + methodName);
      console.log(error);
      callback(error); 
      return; 
    }

    /*SUCCESS Block*/
    console.log("read the following data in " + methodName + ":");
    console.log(JSON.stringify(body));
    
    //Now select the top 4 vendors from this list and return them to the caller
    var vendorID;
    var i,idx=0;
    var topScore = body.values[0][0];

    console.log("1d length=" + body.values.length);
    console.log("2d length=" + body.values[0].length);
    
    //loop to select top score
    for (i=0;i<body.values[0].length;i++){
      if (topScore < body.values[0][i]){
           topScore = body.values[0][i];
           idx = i;
           
      }
    }
    console.log("top value is at >" + idx);
    vendorID = body.fields[0][idx];
    callback(null,vendorID);
});
});
return;
}


exports.populateErrorCard = function (msg,callback) {

  template.errorCardTemplate.payload.google.richResponse.items[0].basicCard.formattedText = msg;
  callback(template.errorCardTemplate);

}


exports.CreatePO = function(callback){

  
  var request = require("request");

  //Note: the quantity used here should be the one returned by getMaterialReqFG21
  var options = { method: 'GET',
    //url: 'http://s4hana7b.isl.edst.ibm.com:8001/sap/opu/odata/sap/ZCREATE_PO_SRV/poSet(Material='FG21',Price='20.00',PriceUnit='1',Quantity='10')?$format=json',
    url:"https://169.47.160.212:44301/sap/opu/odata/sap/ZCREATE_PO_SRV/poSet(Material='FG21',Price='20.00',PriceUnit='1',Quantity='" + Qty + "')?$format=json",
    qs: { '$format': 'json' },
    headers: 
     { 'Content-Type': 'application/json',
     Authorization: 'Basic TkFOU0FSSTpAQ29udHJhMDA=' } };
  
  request(options, function (error, response, body) {
    if (error) {
      callback(error);
      return;
    }
  
    callback(null,body)
    console.log(body);
  });

  return;
  
}

exports.UpdateMasterData = function(callback){

    var request = require("request");

    var options = { method: 'POST',
      url: 'http://169.47.160.211:50300/RESTAdapter/MatMaster',
      headers: 
      { 
        Connection: 'keep-alive',
        Host: '169.47.160.211:50300',
        Accept: '*/*',
        Authorization: 'Basic U0FQUEhJUkVfREVNTzpTYXBwaGlyZTIwMTk=',
        'Content-Type': 'application/json' },
      body: { Material: 'FG21', Plant: '1010' , Area:'KANBAN1010', MRPType: 'D1', MRPController:'001', ReorderPoint:'100' , LotSizing:'EX' },
      json: true };

    request(options, function (error, response, body) {
      if (error) {
        callback(error);
        return;
      }
      console.log("Call to Master Data Update RPA Bot successful!")
      callback(null,body);
    });

    return;
}



exports.RunMRPSimulation = function(callback){

  var request = require("request");

  var options = { method: 'POST',
    url: 'http://169.47.160.211:50300/RESTAdapter/MatMaster',
    headers: 
    { 
      Connection: 'keep-alive',
      Host: '169.47.160.211:50300',
      Accept: '*/*',
      Authorization: 'Basic U0FQUEhJUkVfREVNTzpTYXBwaGlyZTIwMTk=',
      'Content-Type': 'application/json' },
    body: { Material: 'FG21', Plant: '1010' },
    json: true };

  request(options, function (error, response, body) {
    if (error) {
      callback(error);
      return;
    }
    console.log("Call to Master Data Update RPA Bot successful!")
    callback(null,body);
  });

  return;
}