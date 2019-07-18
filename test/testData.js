const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {Prices} = require('../models/priceModel');
const {app, runServer, closeServer} = require('../server');
const {GetPrices} = require("../classes/getPrices");
const {DATABASE_URL,URLUS,USERK,USERP} = require('../config');

chai.use(chaiHttp);

function compareVariants(productData,productIndex,results){
	if(results === undefined){
		results = [];
	}
	var promise = new Promise((resolve,reject) => {
		console.log("productIndex & productData.length: ",productIndex,productData.length);
		if(productIndex < productData.length){
			let productID = productData[productIndex].id
			return Prices.find({'product_id':productID})

			.then(product => {
				/*
				if(product[0].product_title.includes("Dragon")){
					console.log("========================================dragon legnths: ");
					console.log("product from db: ",product[0].variant_data.length,product[0].product_title);
					console.log('product from shopify: ',productData[productIndex].variants.length,productData[productIndex].title);
				}
				*/
				console.log("product from db: ",product[0].variant_data.length,product[0].product_title);
				console.log('product from shopify: ',productData[productIndex].variants.length,productData[productIndex].title);

				if(productData[productIndex].variants.length !== product[0].variant_data.length){
					console.log("found error",productData[productIndex].title);
					results.push({
						id:productID,
						title:productData[productIndex].title
					});
					resolve(compareVariants(productData,productIndex + 1,results));
				}
				else{
					resolve(compareVariants(productData,productIndex + 1,results));
				}
			})
		}
		else{
			resolve(results);
		}
	});

	return promise;
}

describe('Test Length of saved data against shopify data',function(){
	before(function(){
		return runServer(DATABASE_URL);
	});

	after(function() {
	    return closeServer();
	 });

	describe('Get data from DB',function(){
		it('should start server',function(done){
			//set timeout for test
			this.timeout(10000);
			expect(1+1).to.equal(2);
			done();
		});

		it('should get data',function(){
			this.timeout(20000);
			let getPriceDatas = new GetPrices(URLUS,USERK,USERP);
			return getPriceDatas.getData([],0)

			.then(productData => {
				expect(productData).to.have.lengthOf.at.least(1);
			})
			.catch(err => {
				console.log(err)
			})
		})

		it('should all have matching data lengths',function(){
			this.timeout(90000);
			let getPriceDatas = new GetPrices(URLUS,USERK,USERP);
			return getPriceDatas.getData([],0)

			.then(productData => {
				return compareVariants(productData,0)
			})

			.then(results => {
				console.log("=========================results: ",results, results.length);
				expect(results).to.have.lengthOf(0);
			})
			.catch(err => {
				console.log(err)
			})
		})
	});
});