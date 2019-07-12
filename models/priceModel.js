const mongoose = require('mongoose');
//subschema to avoid auto id creation
const variantSchema = mongoose.Schema({
	variant_id:{type:String,required:true},
	variant_price:String	
},{_id:false});
//main shcema
const priceSchema = mongoose.Schema({
	product_id:{type:String,required:true,unique:true},
	variant_data:[variantSchema]
});

priceSchema.serialize = function(){
	return{
		product_id:this.product_id,
		variant_data:this.variant_ids
	}
};

const Prices = mongoose.model("Price",priceSchema);
module.exports = {Prices};