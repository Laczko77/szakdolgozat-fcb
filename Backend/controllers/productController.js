const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');


// Új termék létrehozása
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const parsedPrice = Number(price);

    if (!name || isNaN(parsedPrice) || !category) {
      return res.status(400).json({ error: 'Név, ár és kategória kötelező.' });
    }

    const imageUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
      : '';

    const newProduct = new Product({
      name,
      description,
      price: parsedPrice,
      category,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Hiba termék létrehozásakor:', err);
    res.status(500).json({ error: 'Szerverhiba termék létrehozásakor.' });
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Termék nem található.' });

    // Új kép feltöltése esetén régit töröljük
    if (req.file) {
      if (product.imageUrl) {
        const oldPath = `.${product.imageUrl}`;
        fs.unlink(oldPath, err => {
          if (err) console.error('Régi kép törlése sikertelen:', err);
        });
      }
      product.imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    }

    // Frissíthető mezők
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = Number(req.body.price); // <-- FONTOS!
    if (req.body.category !== undefined) product.category = req.body.category;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Termék szerkesztési hiba:', err);
    res.status(500).json({ error: 'Hiba a termék szerkesztésekor.' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Termék nem található.' });

    // ha volt kép, akkor töröljük a fájlt
    if (product.imageUrl) {
      const imageFileName = product.imageUrl.split('/uploads/products/')[1];
      if (imageFileName) {
        const filePath = path.join(__dirname, '..', 'uploads', 'products', imageFileName);
        fs.unlink(filePath, err => {
          if (err) console.error('Nem sikerült törölni a képet:', err);
        });
      }
    }

    await product.deleteOne();
    res.json({ message: 'Termék törölve.' });
  } catch (err) {
    console.error('Szerverhiba termék törlésekor:', err);
    res.status(500).json({ error: 'Hiba a termék törlésekor.' });
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
