const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {GetPrices} = require("../classes/getPrices");
const {Prices} = require("../models/priceModel");

router.get("/",checkKey,(req,res) =>{
	let productID = req.query.productid;
	return Prices.find({'product_id':productID})

	.then(product => {
		//console.log(product.serialize());
		return res.json({
			status:200,
			data:product[0].serialize()
		})
	})
	.catch(err=>{
		console.log("Error getting single data: ",err);
	})
});

module.exports = {router};