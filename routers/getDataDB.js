const express = require("express");
const router = express.Router();
const {checkKey} = require("../tools/checkKey");
const {SaveToShopify} = require("../classes/saveToShopify");
const {Prices} = require("../models/priceModel");
const {URLUS,USERK,USERP} = require('../config');
//get single product from db
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
//get all products from db and save to shopify
router.get("/saveOld",checkKey,(req,res) =>{
	
	return Prices.find({})

	.then(products => {
		let saveToShopify = new SaveToShopify(products,URLUS,USERK,USERP);

		return saveToShopify.saveData(0)
		//console.log(products);
		/*
		return res.json({
			status:200,
			data:products.map(product =>product.serialize())
		})
		*/
	})

	.then(product =>{
		console.log("sending response")
		return res.json({
			status:200,
			data:product
		})
	})
	.catch(err=>{
		console.log("Error getting all data: ",err);
	})
});

module.exports = {router};