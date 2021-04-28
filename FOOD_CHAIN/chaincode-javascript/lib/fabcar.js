/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
            },
        ];

        // for (let i = 0; i < cars.length; i++) {
        //     cars[i].docType = 'car';
        //     await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
        //     console.info('Added <--> ', cars[i]);
        // }
        // console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    // async uniqidGenerator(){
    //     const today = await new Date();
    //     const id = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate() + "" + today.getHours() + "" + today.getMinutes() + "" + today.getMilliseconds();
    //     return id;
    // }

    // change owner-ship of products
    async changeOwnerShipOfProduct(ctx, productId){
        const productAsBytes = await ctx.stub.getState(productId);
        //console.log(productId); // get the product from chaincode state
        const productJSON = JSON.parse(productAsBytes.toString());
       // const parentProductAsBytes = await ctx.stub.getState(productJSON.parentProductID);
       // const parentProduct = JSON.parse(parentProductAsBytes.toString());
       // parentProduct.quantity = (parseInt(parentProduct.quantity)-parseInt(productJSON.quantity));
        const newOwnerId = productJSON.requestID;
        const validUser = await this.userExists(ctx, newOwnerId);
        if (!validUser) {
            throw new Error(`The user ${id} doesn't exist`);
        }
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productId} does not exist`);
        }
        //console.log(newOwnerId);
        const getNewOwnerAsBytes = await ctx.stub.getState(newOwnerId);
        const newOwner = JSON.parse(getNewOwnerAsBytes.toString());
        //const newOwner = JSON.stringify(newOwner1);

        if (newOwner.role === 'retailer') {
            productJSON.owner = newOwner.org;
            productJSON.ownerID = newOwner.key;
            productJSON.docType = 'products_retailer';
            productJSON.retailer = newOwner.org;
            productJSON.state = 'retailer';
            productJSON.requestID = 'none';
            productJSON.request = 'none';
            await ctx.stub.putState(productId, Buffer.from(JSON.stringify(productJSON)));
            return JSON.stringify(productJSON);
        } else if (newOwner.role === 'consumer') {
            const parentProductAsBytes = await ctx.stub.getState(productJSON.parentProductID);
            const parentProduct = JSON.parse(parentProductAsBytes.toString());
            parentProduct.quantity = (parseInt(parentProduct.quantity)-parseInt(productJSON.quantity)).toString();
            productJSON.owner = newOwner.name;
            productJSON.ownerID = newOwner.key;
            productJSON.consumer = newOwner.name;
            productJSON.docType = 'products_consumer';
            productJSON.state = 'consumer';
            productJSON.requestID = 'none';
            productJSON.request = 'none';
            await ctx.stub.putState(productId, Buffer.from(JSON.stringify(productJSON)));
            await ctx.stub.putState(productJSON.parentProductID, Buffer.from(JSON.stringify(parentProduct)));
            return JSON.stringify(productJSON);
        }
    }

    // async DeleteAsset(ctx, id) {
    //     const exists = await this.AssetExists(ctx, id);
    //     if (!exists) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }
    //     return ctx.stub.deleteState(id);
    // }

    async rejectOwnerShipOfProduct(ctx, productID){
        const productExists = await this.ProductExists(ctx, productID);
        if(!productExists){
            throw new Error(`The product-${id} does not exist`);
        }
        return ctx.stub.deleteState(productID);
         
    }


    async requestOwnerShipOfProduct(ctx, productID, newOwnerId, quantity){
        const getProductAsBytes = await ctx.stub.getState(productID);
        const product = JSON.parse(getProductAsBytes.toString());

        const getNewUserAsBytes = await ctx.stub.getState(newOwnerId);
        const newUser = JSON.parse(getNewUserAsBytes.toString());

        if(newUser.role === 'consumer'){

            const newproductAsBytes = await this.updateProductsOfRetailer(ctx, productID, quantity);

            let newProduct = JSON.parse(newproductAsBytes.toString());

            newProduct.requestID = newOwnerId;
            newProduct.request = 'YES';
            
            await ctx.stub.putState(newProduct.productID, Buffer.from(JSON.stringify(newProduct)));

            return JSON.stringify(newProduct);

        } else if(newUser.role === 'retailer'){

            product.requestID = newOwnerId;
            product.request = 'YES';

            await ctx.stub.putState(productID, Buffer.from(JSON.stringify(product)));

            return JSON.stringify(product);
        }
        
        //return p;
        // const newProduct = JSON.stringify(product);
        // await ctx.stub.putState(productID, Buffer.from(newProduct));
    }

    async userExists(ctx, userId){
        const userJSON = await ctx.stub.getState(userId);
        return userJSON && userJSON.length > 0;
    }
    
    async ProductExists(ctx, productId) {
        const productJSON = await ctx.stub.getState(productId);
        return productJSON && productJSON.length > 0;
    }

    // async UpdateProduct(ctx, productID, quantity, owner) {
    //     const exists = await this.ProductExists(ctx, productID);
    //     if (!exists) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }

    //     // overwriting original asset with new asset
    //     const updatedAsset = {
    //         productID,
    //         quantity,
    //         owner,
    //     };
    //     return ctx.stub.putState(productID, Buffer.from(JSON.stringify(updatedAsset)));
    // }

    async org (ctx, id, name, role, org){
        const orgn = {
            docType: 'org',
            id,
            name,
            role,
            org:org,
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(orgn)));
    }



    //registration of a user
    async registerUser(ctx, userId, email, password, name, role, org){
        console.info('============= START : Register User ===========');

        const user = {
            docType: 'user',
            email,
            password,
            name,
            key: userId,
            org: org,
            role: role,
        };
        const orgId = user.key+"org";
        await this.org(ctx, orgId, name, user.role, user.org);

        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
        //return user.toString();
        //console.info('============= END : Register User ===========');
    }

    async findUser(ctx, email, password){
        const id = email;
        const userAsBytes = await ctx.stub.getState(id);

        if(!userAsBytes || userAsBytes.length === 0){
            throw new Error(`The user with ${email} doesn't exist`);
        }

        const user = JSON.parse(userAsBytes.toString());
        if(user.password !== password){
            throw new Error(`Provided Email & Password don't match any user in our system`);
        }
        return JSON.stringify(user);
    }

    //create new products of producer into the state
    //change unit params  
    async createProductsOfProducer(ctx, productID, userID, name, quantity, unit){
        console.info('============= START : Create Products ===========');

        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());
        const products = {
            docType: 'products_producer',
            productID,
            parentProductID:'none',
            name,
            quantity,
            owner: user.org,
            ownerID: user.key,
            producer: user.org,
            retailer: 'none',
            consumer: 'none',
            state: 'producer',
            unit,
            request: 'none',
            requestID:'none',
        };
        await ctx.stub.putState(productID, Buffer.from(JSON.stringify(products)));
        return JSON.stringify(products);
        //return JSON.stringify(products);
        //console.info('============= END : Create Products ===========');
    }


    //create new products of retailer into the state
    async updateProductsOfRetailer(ctx, productID, quantity){
        console.info('============= START : Create Products ===========');

        const productAsBytes = await ctx.stub.getState(productID);
        const productJSON = JSON.parse(productAsBytes.toString());

        const today = new Date();

        const newproductID = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate()+""+today.getHours()+""+today.getMinutes()+""+today.getMilliseconds();
        
        //let qty1 = parseInt(productJSON.quantity);
        //const qty = parseInt(quantity);
        // qty1 = qty1 - qty2;
        // productJSON.quantity = qty1.toString();
        
        const products = {
            docType: 'products_retailer',
            parentProductID: productID,
            productID: newproductID,
            name: productJSON.name,
            quantity: quantity,
            owner: productJSON.owner,
            ownerID: productJSON.ownerID,
            producer: productJSON.producer,
            retailer: productJSON.retailer,
            consumer: 'none',
            state: 'retailer',
            unit: 'KG',
            request: 'none',
            requestID: 'none',
        };

        await ctx.stub.putState(newproductID, Buffer.from(JSON.stringify(products)));
        return JSON.stringify(products);
    }



    async queryAllProductsofProducers(ctx){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_producer';
        queryString.selector.state = 'producer';


        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('Something went wrong');
        }

        let products = JSON.parse(queryResults.toString());

        if(products.length === 0){
            throw new Error('No products to show');
        }

        return JSON.stringify(products);
    }

    async queryRequestsOfProducer(ctx, userID){

        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_producer';
        queryString.selector.ownerID = user.key;
        queryString.selector.request = 'YES';
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('NO product request yet');
        }

        let products = JSON.parse(queryResults.toString());

        return JSON.stringify(products);
    }

    async queryRequestsOfRetailer(ctx, userID){

        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_retailer';
        queryString.selector.ownerID = user.key;
        queryString.selector.request = 'YES';
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('NO product request yet');
        }

        let products = JSON.parse(queryResults.toString());

        return JSON.stringify(products);
    }

    async queryqueryRetailerProductsbyID(ctx, userID){

        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_retailer';
        queryString.selector.ownerID = user.key;
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('NO product to show');
        }

        let products = JSON.parse(queryResults.toString());

        return JSON.stringify(products);
    }

    async queryqueryProducerProductsbyID(ctx, userID){
        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_producer';
        queryString.selector.ownerID = user.key;
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('NO product to show');
        }

        let products = JSON.parse(queryResults.toString());

        return JSON.stringify(products);
    }

    async queryConsumerProductsbyID(ctx, userID){
        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_consumer';
        queryString.selector.ownerID = user.key;
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('NO product request yet');
        }

        let products = JSON.parse(queryResults.toString());

        return JSON.stringify(products);
    }


    async queryAlProductsofRetailer(ctx){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_retailer';
        queryString.selector.state = 'retailer'; 

        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('Something went wrong');    
        }

        let products = JSON.parse(queryResults.toString());

        if(products.length === 0){
            throw new Error('No products to show');
        }

        return JSON.stringify(products);
    }

    async queryAllProductsofRetailer(ctx){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_retailer';
        queryString.selector.state = 'retailer';

        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('Something went wrong');    
        }

        let products = JSON.parse(queryResults.toString());

        if(products.length === 0){
            throw new Error('No products to show');
        }

        return JSON.stringify(products);
    }

    async queryAllProductsofConsumer(ctx, userID){

        const userAsBytes = await ctx.stub.getState(userID);
        const user = JSON.parse(userAsBytes.toString());

        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'products_consumer';
        queryString.selector.state = 'retailer';
        queryString.selector.owner = user.name;

        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('Something went wrong');
        }

        let products = JSON.parse(queryResults.toString());

        if(products.length === 0){
            throw new Error('No products to show');
        }

        return JSON.stringify(products);
    }

    //query single product
    async queryProduct(ctx, productID) {
        const productAsBytes = await ctx.stub.getState(productID); // get the car from chaincode state
        if (!productAsBytes || productAsBytes.length === 0) {
            throw new Error(`${productID} does not exist`);
        }
        //console.log(productAsBytes.toString());
        const product = JSON.parse(productAsBytes.toString());
        return JSON.stringify(product);
        //return productAsBytes.toString();
    }

    async queryAllProducts(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async loginUser(ctx, email, password) {
        console.info('============= START : Login User ===========');
        
        // query user based on email and password
        //if info is correct return successful
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'user';
        queryString.selector.email = email;
        queryString.selector.password = password;

        //run query
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if (!queryResults || queryResults.length === 0) {
            throw new Error('Wrong Email or Password');
        }
        let users = JSON.parse(queryResults.toString());

        if(users.length === 0){
            throw new Error('Wrong Email or Password');
        }

        console.info('============= END : Login User ===========');

        return users[0].key;
    }

    async getQueryResultForQueryString(ctx, queryString) {

        console.info('- getQueryResultForQueryString queryString:\n' + queryString);
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
    
        let results = await this.getAllResults(resultsIterator, false);
    
        return Buffer.from(JSON.stringify(results));
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
    
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              jsonRes.IsDelete = res.value.is_delete.toString();
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            //console.info(allResults);
            return allResults;
          }
        }
    }
}

module.exports = FabCar;
