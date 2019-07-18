const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;

describe('Test Old data with Shopify data',function(){

	it('should pass this test',function(done){
		expect(1+1).to.equal(2);
		done();
	});

});