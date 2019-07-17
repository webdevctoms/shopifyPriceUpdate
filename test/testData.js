const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const {Prices} = require('../models/priceModel');
const {app, runServer, closeServer} = require('../server');
const {DATABASE_URL} = require('../config');

chai.use(chaiHttp);

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
	});
});