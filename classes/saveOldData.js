function OldData(productData,priceModel){
	this.productData = productData;
	this.priceModel = priceModel;
}
//return variant price and id
OldData.prototype.getVariantData = function(variants) {
	let variantData = [];

	for(let i = 0;i < variants.length;i++){

		let singleVariant = {
			variant_id:variants[i].id,
			variant_price:variants[i].price,
			item_code:variants[i].sku
		}

		variantData.push(singleVariant);
	}

	return variantData;
};
//save to db
//also use this to update price?
OldData.prototype.saveData = function(productIndex) {
	//save one product
	let promise = new Promise((resolve,reject) => {
		console.log("save product data: ",productIndex,this.productData.length);
		let variantData = this.getVariantData(this.productData[productIndex].variants);
		return this.priceModel.create({
			product_id:this.productData[productIndex].id,
			product_title: this.productData[productIndex].title,
			variant_data:variantData
		})

		.then(data => {
			resolve(data);
		})
	});

	return promise;
};

module.exports = {OldData};