const request = require('request');

function GetPrices(url,user_k,user_p){
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
}

GetPrices.prototype.getData = function(dataArray,page) {
	if(dataArray === undefined){
		dataArray = [];
	}
	var promise = new Promise((resolve,reject) => {
		let newUrl = this.url + "products.json?" + "limit=250&fields=id,title,variants";
		if(page !== undefined){
			newUrl += "&page=" + page;
		}
		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		//console.log(newUrl,this.user_k,this.user_p,authKey);
		const options = {
			url:newUrl,
			headers:{
				"Authorization":"Basic " + authKey
			}
		}
		console.log("===============Making request",newUrl,page);
		request(options,function(error,response,body){
			
			let parsedBody = JSON.parse(body);
			console.log("===============Got data: ",parsedBody.products.length);
			if(parsedBody.products.length !== 0){
				//possibly just push data straight into dataArray?
				for(let i = 0;i < parsedBody.products.length;i++){
					let currentProduct = parsedBody.products[i];
					let currentObject = {};
					currentObject.id = currentProduct.id;
					currentObject.variants = currentProduct.variants;
					currentObject.title = currentProduct.title;
					//console.log(currentObject.title);
					dataArray.push(currentObject);
				}
				//let lastId = parsedBody.products[parsedBody.products.length - 1].id;
				resolve(this.getData(dataArray,page + 1));
			}
			else{
				
				resolve(dataArray);
			}

		}.bind(this));
	});

	return promise;
};

module.exports = {GetPrices};