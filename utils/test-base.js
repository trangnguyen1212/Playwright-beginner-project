const base = require('@playwright/test');


exports.customtest = base.test.extend(
{
    testDataForOrder :    {
            testID: "01",
            testDescription: "Client App login",
            username : "anshika@gmail.com",
            password : "Iamking@000",
            productName:"ADIDAS ORIGINAL"
            
        },

     testDataForInvalidOrder :    {
            testID: "02",
            username : "333a@gmail.com",
            password : "Iamking@000",
            productName:"ADIDAS ORIGINAL"
        
        }

}

)




