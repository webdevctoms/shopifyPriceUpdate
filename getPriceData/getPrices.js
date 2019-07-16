const request = require('request');

function GetPrices(url,user_k,user_p){
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
}
//error getting data
GetPrices.prototype.getData = function(dataArray,lastId) {
	if(dataArray === undefined){
		dataArray = [];
	}
	var promise = new Promise((resolve,reject) => {
		let newUrl = this.url + "products.json?" + "limit=1&fields=id,title,variants";

		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		//console.log(newUrl,this.user_k,this.user_p,authKey);
		const options = {
			url:newUrl,
			headers:{
				"Authorization":"Basic " + authKey
			}
		}

		request(options,function(error,response,body){
			
			let parsedBody = JSON.parse(body);
			console.log(parsedBody);
			resolve(parsedBody);
		});
	});

	return promise;
};

module.exports = {GetPrices};