/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'fabcar';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
const cors = require('cors');




function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
			///////////////////////////////////////////////////////////////////
			// create server

			let express = require('express');
			const cookieParser = require('cookie-parser');
			
			let app = express();
			const PORT = 5000;
			app.use(cors());
			app.use(function(req, res, next) {
				res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
				   next();
			 });
			app.use(cookieParser());
			app.use(express.urlencoded({extended: false}));
			app.use(express.json());
			

			app.post('/register', async function(req, res){
				// read parameters from request
				const { email, password, name, role, org } = req.body;

				try{
					let result = await contract.evaluateTransaction(
						'registerUser',
						email,
						email,
						password,
						name,
						role,
						org);

					await contract.submitTransaction(
						'registerUser',
						email,
						email,
						password,
						name,
						role,
						org);
					res.send(result.toString());
				} catch(error){
					res.status(400).send(error.toString());
				}
			});
			//registerUser(ctx, userId, email, password, name, role, org)
			app.post('/login', async function(req, res){
				// read parameters from request
				const { email, password } = req.body;

				try{
					let result = await contract.evaluateTransaction('findUser', email, password);
					res.cookie('user', result.toString(), {maxAge: 3600000, httpOnly: true});
					//await contract.submitTransaction('findUser', email, password);
					res.send(result.toString());
				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.get('/logout', async function(req, res){
				// read parameters from request
				// const { email, password } = req.body;

				try{
					res.cookie('user', '', {maxAge: -1, httpOnly: true});
					//await contract.submitTransaction('findUser', email, password);
					res.send('You have successfully logged out');
				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.post('/products', async function(req, res){
				try{
					if(req.cookies.user == null){
						res.status(400).send(' Ops!, You are not logged in !');
						return;
					}
					
					const user = JSON.parse(req.cookies.user.toString());
					console.log(user);
					const userID = user.key;
					console.log(userID);
					const {productname, quantity, unit} = req.body;
					const today = new Date();
					const productID = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate() + "" + today.getHours() + "" + today.getMinutes() + "" + today.getMilliseconds();
					
					let result = await contract.evaluateTransaction('createProductsOfProducer', productID, userID, productname, quantity, unit);
					console.log(result.toString());
					await contract.submitTransaction('createProductsOfProducer', productID, userID, productname, quantity, unit);
					res.send(result.toString());
				} catch(error){
					res.status(400).send(error.toString());
				}
			});
			app.get('/products/producers_products', async function(req, res){

				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try{

					let result = await contract.evaluateTransaction('queryAllProductsofProducers');
					res.send(result.toString());
					
				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.get('/products/retailers_products', async function(req, res){

				if(req.cookies.user == null){
					res.status(400).send('You are not logged in');
					return;
				}
				
				try{

					let result = await contract.evaluateTransaction('queryAllProductsofRetailer');

					res.send(result.toString());

				} catch(error){
					res.status(400).send(error.toString());
				}
			});
			app.get('/products/producer', async function(req, res){
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try{
					const user = JSON.parse(req.cookies.user.toString());
					const userID = user.key;

					console.log(userID);
					let result = await contract.evaluateTransaction('queryProducerProductsbyID', userID);

					res.send(result.toString());

				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.get('/products/retailer', async function(req, res){
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try{
					const user = JSON.parse(req.cookies.user.toString());
					const userID = user.key;

					let result = await contract.evaluateTransaction('queryRetailerProductsbyID', userID);

					res.status(422).send(result.toString());

				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.get('products/consumer', async function(req, res){
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try{
					const user = JSON.parse(req.cookies.user.toString());
					const userID = user.key;

					let result = await contract.evaluateTransaction('queryConsumerProductsbyID', userID);

					res.status(422).send(result.toString());

				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.put('/products/request/:productID', async function(req, res){
				try{
					if(req.cookies.user == null){
						res.status(400).send('You are not logged in');
					}
					const quantity = req.body.quantity;
					const productID = req.params.productID;
					console.log(productID);
					const newOwner = JSON.parse(req.cookies.user.toString());
					const newOwnerId = newOwner.key;
					console.log(newOwnerId);
					console.log(newOwner.role);

					let result = await contract.evaluateTransaction('requestOwnerShipOfProduct', productID, newOwnerId, quantity);
					console.log(result.toString());
					await contract.submitTransaction('requestOwnerShipOfProduct', productID, newOwnerId, quantity);
					res.send(result.toString());
				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.put('/products/change_owner/:productID', async function(req, res){
				try{
					if(req.cookies.user == null){
						res.status(400).send('You are not logged in');
					}
					
					const productID = req.params.productID;

					let result = await contract.evaluateTransaction('changeOwnerShipOfProduct', productID);
					await contract.submitTransaction('changeOwnerShipOfProduct', productID);

					res.send(result.toString());
				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.delete('/products/:productID', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				const productID = req.params.productID;

				try {
					const user = JSON.parse(req.cookies.user.toString());
					let result = await contract.evaluateTransaction('rejectOwnerShipOfProduct',productID);

					console.log(result);
					const product = JSON.parse(result.toString());


					if (product.ownerID != user.key) {
						res.status(403).send("You are not authorized to delete this file");
					} else {
						let result = await contract.evaluateTransaction('rejectOwnerShipOfProduct', productID);
						await contract.submitTransaction('rejectOwnerShipOfProduct', productID);
						res.send(result.toString());
					}
				} catch (err) {
					res.status(400).send(err.toString());
				}
			});


			app.get('/products/producer/requests/', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try {
					const user = JSON.parse(req.cookies.user.toString());
					const userID = user.key;
					let result = await contract.evaluateTransaction('queryRequestsOfProducer', userID);
					res.send(result.toString());
				} catch (err) {
					res.status(400).send(err.toString());
				}
			});

			app.get('/products/retailer/requests', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try {
					const user = JSON.parse(req.cookies.user.toString());
					const userID = user.key;
					let result = await contract.evaluateTransaction('queryRequestsOfRetailer', userID);
					res.status(422).send(result.toString());
				} catch (err) {
					res.status(400).send(err.toString());
				}
			});

			

			app.get('/showAll', async function(req, res){
				if(req.cookies.user == null){
					res.status(400).send('You are not logged in');
					return;
				}
				
				try{

					let result = await contract.evaluateTransaction('queryAllProducts');

					res.send(result.toString());

				} catch(error){
					res.status(400).send(error.toString());
				}
			});

			app.get('/profile', async function(req, res){
				if(req.cookies.user == null){
					res.status(400).send('You are not logged in');
					return;
				}
				
				try{

					let result = JSON.parse(req.cookies.user.toString());
					console.log(result.name);
					console.log('done...');

					res.status(422).send(result);

				} catch(error){
					res.status(400).send(error.toString()+'                            not done');
				}
			});

			// app.get('/userinfo', async function(req, res){
			// 	if(req.cookies.user == null){
			// 		res.status(400).send('You are not logged in');
			// 		return;
			// 	}
				
			// 	try{

			// 		let result = JSON.parse(req.cookies.user.toString());
			// 		console.log(result);
			// 		console.log('done...');

			// 		res.status(422).send(result);

			// 	} catch(error){
			// 		res.status(400).send(erro.toString()+'                            not done');
			// 	}
			// });



			var server = app.listen(PORT, function () { 
				console.log(`Server listening on port http://localhost:${PORT}`);
			});

			///////////////////////////////////////////////////////////////////
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			//gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
