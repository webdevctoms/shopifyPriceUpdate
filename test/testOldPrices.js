const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {app, runServer, closeServer} = require('../server');
const {GetPrices} = require("../classes/getPrices");
const {comparePrices} = require('./comparePrices');
const {DATABASE_URL,URLUS,USERK,USERP} = require('../config');



describe('Test Old data with Shopify data',function(){

	it('should pass this test',function(done){
		expect(1+1).to.equal(2);
		done();
	});

	it('all prices should match',function(){
		this.timeout(90000);
		let getPriceDatas = new GetPrices(URLUS,USERK,USERP);
		return getPriceDatas.getData([],0)

		.then(productData => {
			//change this to test after conversion
			let conversion = 1.27;
			return comparePrices(productData,0,conversion,[])
		})

		.then(results => {
			console.log("=========================results from compare prices: ",results, results.length);
			expect(results).to.have.lengthOf(0);
		})

		.catch(err => {
			console.log(err)
		})
	});

});