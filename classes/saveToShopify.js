const request = require('request');

function SaveToShopify(productData,url,user_k,user_p){
	this.productData = productData;
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
}

SaveToShopify.prototype.saveData = function(productIndex) {
	var promise = new Promise((resolve,reject) => {
		//let productID = this.productData[productIndex].id ? this.productData[productIndex].id : this.productData[productIndex].product_id;
		let productID = 2063102705757;
		let newUrl = this.url + "products/" + productID + ".json";
		console.log(newUrl);
		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		const options = {
			url:newUrl,
			method:"PUT",
			headers:{
				"Authorization":"Basic " + authKey
			},
			/*
			body:JSON.stringify({
				"product":{
					"variants":[
						{
							"id":"20197033410653",
							"price":"18.00"
						}
					]
				}
			})
			*/
			json:{
				"product":{
					"variants":[
						{
							"id":"20197033410653",
							"price":"18.00"
						}
					]
				}
			}
		};

		console.log(options);

		request(options,function(error,response,body){
			console.log(body);
			let parsedBody = JSON.parse(body);
			console.log("===============PUT data: ",parsedBody.product.length);

			resolve(parsedBody);

		}.bind(this));
	});

	return promise;
};

module.exports = {SaveToShopify};