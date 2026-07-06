const Product = require('../models/Product');

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const generateProductId = (category, name) => {
  const base = `${category || 'product'}-${slugify(name || 'item')}`.slice(0, 48);
  return `${base}-${Date.now().toString(36)}`;
};

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
};

const createProduct = async (req, res) => {
  const {
    id,
    _id,
    name,
    description,
    category,
    price,
    salePrice,
    images,
    stock,
    featured,
    tags,
  } = req.body;

  if (!name || !description || !category || price === undefined || price === null) {
    return res.status(400).json({
      message: 'Name, description, category, and price are required',
    });
  }

  const productId = id || _id || generateProductId(category, name);

  const existing = await Product.findById(productId);
  if (existing) {
    return res.status(409).json({ message: 'A product with this ID already exists' });
  }

  const productImages =
    Array.isArray(images) && images.length > 0
      ? images
      : [{ url: '/placeholder.svg', alt: name }];

  const product = new Product({
    _id: productId,
    name,
    description,
    category,
    price: Number(price),
    salePrice: salePrice !== undefined && salePrice !== '' ? Number(salePrice) : undefined,
    images: productImages,
    stock: stock !== undefined && stock !== '' ? Number(stock) : 0,
    featured: featured ?? false,
    tags: tags || [],
  });

  await product.save();
  res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updates = ['name', 'description', 'category', 'price', 'salePrice', 'images', 'stock', 'featured', 'tags'];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  await product.save();
  res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
