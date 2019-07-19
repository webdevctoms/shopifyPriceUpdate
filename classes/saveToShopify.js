const request = require('request');

function SaveToShopify(productData,url,user_k,user_p){
	this.productData = productData;
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
}

SaveToShopify.prototype.convertVariants = function(variants){
	let shopifyVariants = [];

	for(let i = 0;i < variants.length;i++){
		let varaint = {};
		varaint.id = String(variants[i].variant_id);
		varaint.price = String(variants[i].variant_price);
		shopifyVariants.push(varaint);
	}

	return shopifyVariants;
}

SaveToShopify.prototype.saveData = function(productIndex) {
	var promise = new Promise((resolve,reject) => {
		let productID = this.productData[productIndex].product_id ? this.productData[productIndex].product_id:this.productData[productIndex].id;
		//let productID = 2063102705757;
		let newUrl = this.url + "products/" + productID + ".json";
		console.log(newUrl);
		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		let shopifyVariants = this.convertVariants(this.productData[productIndex].variant_data);
		//console.log(shopifyVariants);
		const options = {
			url:newUrl,
			method:"PUT",
			headers:{
				"Authorization":"Basic " + authKey
			},
			json:{
				"product":{
					"variants": shopifyVariants		
				}
			}
		};

		//console.log(options);

		request(options,function(error,response,body){
			if(body.errors){
				console.log(body);
			}
			//console.log(body);
			//let parsedBody = JSON.parse(body);
			console.log("===============PUT data: ",productIndex,this.productData.length,this.productData[productIndex].product_title);
			if(productIndex < this.productData.length - 1){
				resolve(this.saveData(productIndex + 1));
			}
			else{
				console.log("final price update");
				resolve(body);
			}
			

		}.bind(this));
	});

	return promise;
};

module.exports = {SaveToShopify};