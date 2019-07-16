require('dotenv').config();
const express = require("express");
const router = express.Router();
const {Prices} = require("../models/priceModel");
const {checkKey} = require("../tools/checkKey");
const {GetPrices} = require("../classes/getPrices");
const {OldData} = require("../classes/saveOldData");
const {URLUS,USERK,USERP} = require('../config');

router.get("/",(req,res) => {
	/*
	return Prices.create({
		product_id:"1234",
		variant_data:[
			{
				variant_id:"12345",
				variant_price:"50.00"
			},
			{
				variant_id:"12345678"
			}
		]
	})
	*/

	let getPriceDatas = new GetPrices(URLUS,USERK,USERP);
	return getPriceDatas.getData()

	.then(productData => {
		console.log("Product Data: ",productData.length);
		let oldData = new OldData(productData,Prices);

		return oldData.saveData(1)
		
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