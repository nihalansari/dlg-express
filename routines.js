const inventoryDataset = "./data/inventory.json";
const getStockInfo = (product,suburb) => {
    const fs = require('fs');
    let fileAsStr = fs.readFileSync(inventoryDataset).toString();
    let fileAsJson = JSON.parse(fileAsStr);

    //Step1: identify unique courses. Append all student names against the subject_code
    for(i of fileAsJson){
        console.log(i);
        //trimming to be safe, as I have noticed whitespace suffixed to parameter values (from dialogflow)
        product=product.toString().trim();
        if (i.productname == product){
            for (p of i.productdetails.storesinventory){
                console.log(p);
                if(p.suburb == suburb){
                    console.log("MATCH: found product and suburb!!");
                    return p.countavailable;
                }
            }
        }

    }
    return 0;

}


exports.getStockInfo = getStockInfo;



