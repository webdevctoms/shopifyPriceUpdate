require('dotenv').config();
const express = require("express");
const router = express.Router();
const {Prices} = require("../models/priceModel");
const {checkKey} = require("../tools/checkKey");
const {GetPrices} = require("../classes/getPrices");
const {OldData} = require("../classes/saveOldData");
const {URLUS,USERK,USERP} = require('../config');

router.get("/",checkKey,(req,res) => {

	let getPriceDatas = new GetPrices(URLUS,USERK,USERP);
	return getPriceDatas.getData([],0)

	.then(productData => {
		console.log("Product Data: ",productData.length);
		let oldData = new OldData(productData,Prices);
		//let copies = oldData.checkForCopies();
		//console.log("Copy data: ",copies.length);
		return oldData.saveData(0)
		
	})
	.then(data => {
		return res.json({
			status:200,
			message:"done",
			data
		});
	})
	.catch(err => {
		console.log("error getting data: ",err);
		return res.json({
			status:500,
			message:"An error occured"
		})
	})
});

module.exports = {router};