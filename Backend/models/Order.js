const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },           // ➔ termék név rögzítve
      price: { type: Number, required: true },           // ➔ termék ár rögzítve
      imageUrl: { type: String },                        // ➔ termék kép URL rögzítve
      quantity: { type: Number, required: true, min: 1 },
      size: { type: String },                            // ➔ választott méret
      player: {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String }
      }                                                  // ➔ választott játékos (ha van)
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Feldolgozás alatt', 'Teljesítve'],
    default: 'Feldolgozás alatt'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
