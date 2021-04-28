/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
// var uniqid = require('uniqid');

//console.log(uniqid());

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        // await contract.submitTransaction('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom');
        //await contract.submitTransaction('registerUser', 'sherlocked123@gmail.com', 'sherlocked123@gmail.com', 'sherlocked123', 'sherlocked');
        
        //console.log(uniqid());
        const today = new Date();
        const productID = today.getFullYear()+""+(today.getMonth()+1)+""+today.getDate()+""+today.getHours()+""+today.getMinutes()+""+today.getMilliseconds();
        //await contract.submitTransaction('createProducts', productID, 'RICE', '10 KG', 'Isaaq');
        //await contract.submitTransaction('registerUser', 'a12@gmail.com', 'a12@gmail.com', 'a12', 'yoyo');

        //await contract.submitTransaction('registerUser', 'a@gmail.com', 'a@gmail.com', 'a012', 'A012','producer', 'A company');
        //createProductsOfProducer(ctx, productID, name, quantity, org, unit='KG')
        //await contract.submitTransaction('createProductsOfProducer', productID, 'a@gmail.com','RICE', '100', 'KG');
        // console.log(p);
        //await contract.submitTransaction('registerUser', 'b012@gmail.com', 'b012@gmail.com', 'b012', 'B012', 'retailer', 'B company');
        //await contract.submitTransaction('registerUser', 'b123@gmail.com', 'b012@gmail.com', 'b123', 'B123', 'consumer', 'consumer');
        //await contract.submitTransaction('requestOwnerShipOfProduct', '2021424734204', 'b012@gmail.com', '100');
           //await contract.submitTransaction('requestOwnerShipOfProduct', '20214262211609', 'a1234@gmail.com', '100');
        //  console.log(p);
         //const p = await contract.submitTransaction('updateProductsOfRetailer', '2021424210667', '10');
         //console.log(p.toString());
        //await contract.submitTransaction('changeOwnerShipOfProduct', '2021424139376');
        // console.log(p);
        //const p = await contract.submitTransaction('queryProduct', '2021424139376');
        //console.log(p.toString());
        //updateProductsOfRetailer(ctx, productID, quantity)
        //queryProduct(ctx, productID)
        //changeOwnerShipOfProduct(ctx, productId);
        //requestOwnerShipOfProduct(ctx, productID, newOwnerId, quantity)
        //createProductsOfProducer(ctx, productID, userID, name, quantity, unit)
        //registerUser(ctx, userId, email, password, name, role, org)
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
