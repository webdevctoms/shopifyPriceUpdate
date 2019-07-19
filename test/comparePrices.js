const {Prices} = require('../models/priceModel');

function comparePrices(shopifyProducts,index,conversionFactor,results){

	var promise = new Promise((resolve,reject) => {
		console.log("price test index & shopifyProducts.length: ",index,shopifyProducts.length);
		if(index < shopifyProducts.length){
			let productID = shopifyProducts[index].id;
			return Prices.find({'product_id':productID})

			.then(product => {
				console.log("product from db: ",product[0].variant_data.length,product[0].product_title);
				console.log('product from shopify: ',shopifyProducts[index].variants.length,shopifyProducts[index].title);
				for(let i = 0;i < shopifyProducts[index].variants.length;i++){
					let IDMatch = false;
					let priceMactch = false;
					let errorObject = {};
					for(let k = 0;k < product[0].variant_data.length;k++){

						if(shopifyProducts[index].variants[i].id == product[0].variant_data[k].variant_id){
							IDMatch = true;
							let roundedPrice = Math.round(parseFloat(product[0].variant_data[k].variant_price) / conversionFactor * 100) / 100;
							//handle whole numbers
							if(roundedPrice % 1 === 0){
								roundedPrice = String(roundedPrice) + '.00';
							}
							//handle single decimal points
							else if((roundedPrice) * 10 % 1 === 0){
								roundedPrice = String(roundedPrice) + '0';
							}
							else{
								roundedPrice = String(roundedPrice);
							}

							if(shopifyProducts[index].variants[i].price == roundedPrice){
								priceMactch = true;
								//break;
							}
						}
						if(shopifyProducts[index].id == 2063113420893){
							let roundedPrice = String(Math.round(parseFloat(product[0].variant_data[k].variant_price) / conversionFactor * 100) / 100);
							console.log("============================ids: ",shopifyProducts[index].variants[i].id,product[0].variant_data[k].variant_id,shopifyProducts[index].variants[i].id == product[0].variant_data[k].variant_id);
							console.log("============================id count: ",IDMatch);
							console.log("============================prices: ",shopifyProducts[index].variants[i].price,product[0].variant_data[k].variant_price,roundedPrice);
							console.log("============================price count: ",priceMactch);
						}
					}

					if(!IDMatch){
						//console.log('IDMatch: ',IDMatch,shopifyProducts[index].variants.length);
						errorObject.id_error = shopifyProducts[index].title;
					}

					if(!priceMactch){
						//console.log('priceMactch: ', priceMactch,shopifyProducts[index].variants.length);
						errorObject.price_error = shopifyProducts[index].title;
						errorObject.price_val = product[0].variant_data;
					}

					if(Object.keys(errorObject).length > 0){
						results.push(errorObject);
					}
				}

				resolve(comparePrices(shopifyProducts,index + 1,conversionFactor,results));
			})

			.catch(err => {
				console.log("Error in comparePrices: ",err);
			});
		}
		else{
			resolve(results);
		}
	});
	
	return promise;
}

module.exports = {comparePrices};