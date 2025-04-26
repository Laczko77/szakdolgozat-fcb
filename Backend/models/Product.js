const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: String }, 
  availableSizes: { type: [String], default: ['XS','S', 'M', 'L', 'XL', 'XXL'] }, // fix lista
  
});

module.exports = mongoose.model('Product', ProductSchema);
