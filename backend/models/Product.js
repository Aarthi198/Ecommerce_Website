const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  alt: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
  images: [imageSchema],
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  tags: [String],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.virtual('id').get(function () {
  return this._id;
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
