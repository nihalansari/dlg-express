const inventoryDataset = "./data/inventory.json";
const locationDataset = "./data/inventory.json";
const getStockInfo = (product,suburb) => {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(inventoryDataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);

    const coord = suburbExists();
    if(coord === null){
        return "Error! Store/Suburb does not exist."
    }
    //Step1: identify unique courses. Append all student names against the subject_code
    for(i of fileAsJson){
        console.log(i);
        if (i.productname === product){
            for (p of i.productdetails.storesinventory){
                console.log(p);
                if(p.suburb === suburb){
                    console.log("found product and suburb!!");
                    return p.countavailable;
                } else {
                    console.log(typeof suburb + "," + typeof p.suburb);
                    console.log(">" + p.suburb +  "< Vs >" + suburb + "<");
                }
            }
        }

    }
    return 0

}

const suburbExists = function(suburb){
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(locationDataset).toString();
    var fileAsJson = JSON.parse(fileAsStr);
    for(i of fileAsJson){
        if (i.suburb === suburb ){
            return fileAsJson.gps_coordinates;
        }
    }
    return null;
}

exports.getStockInfo = getStockInfo;



