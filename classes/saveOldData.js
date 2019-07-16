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

OldData.prototype.checkForCopies = function() {
	let copyData = [];
	let uniqueIds = {};
	for(let i = 0;i < this.productData.length;i++){
		if(!uniqueIds[this.productData[i].id]){
			uniqueIds[this.productData[i].id] = this.productData[i].id;
			console.log("=========unique item: ",this.productData[i].title,i);
		}
		else{
			console.log("==========Found Copy: ",this.productData[i].id,this.productData[i].title,i);
			copyData.push(this.productData[i]);
		}
	}

	return copyData;
};
//save to db
//also use this to update price?
OldData.prototype.saveData = function(productIndex) {
	//save one product
	let promise = new Promise((resolve,reject) => {
		console.log("===========save product data: ",productIndex,this.productData.length,this.productData[productIndex].title);
		if(productIndex !== this.productData.length){
			let variantData = this.getVariantData(this.productData[productIndex].variants);
			return this.priceModel.create({
				product_id:this.productData[productIndex].id,
				product_title: this.productData[productIndex].title,
				variant_data:variantData
			})

			.then(data => {
				resolve(this.saveData(productIndex + 1));
			})

			.catch(err => {
				console.log("===========Error saving products: ",productIndex,this.productData[productIndex].title);
				console.log(err);
				if(err.errmsg.includes("E11000")){
					resolve(this.saveData(productIndex + 1));
				}
				else{
					resolve(err);
				}		
			})
		}
		else{
			resolve("Done");
		}
		
	});

	return promise;
};

module.exports = {OldData};