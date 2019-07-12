const express = require("express");
const router = express.Router();
const {Prices} = require("../models/priceModel");
const {checkKey} = require("../tools/checkKey");

router.get("/",checkKey,(req,res) => {
	
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

	.then(priceData => {
		console.log("Length: ",priceData);
		return res.json({
			status:200,
			data:priceData
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