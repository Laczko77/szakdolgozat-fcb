const Product = require('../models/Product');

// Új termék létrehozása
const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Hiba a termék létrehozásakor:', error);
    res.status(500).json({ message: 'Nem sikerült létrehozni a terméket.' });
  }
};

// Termékek listázása
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Hiba a termékek lekérdezésekor:', error);
    res.status(500).json({ message: 'Nem sikerült lekérni a termékeket.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Termék nem található' });
    res.json(updated);
  } catch (err) {
    console.error('Hiba a termék frissítésekor:', err);
    res.status(500).json({ message: 'Nem sikerült frissíteni a terméket.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Termék sikeresen törölve' });
  } catch (err) {
    res.status(500).json({ message: 'Hiba történt a törlés során' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Termék nem található' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a termék lekérdezésekor' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById
};
