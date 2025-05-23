const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');


// Új termék létrehozása
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const parsedPrice = Number(price);

    if (!name || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'A név 2–100 karakter hosszú legyen.' });
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: 'Az ár érvényes, pozitív szám kell legyen.' });
    }

    if (!category || category.trim().length < 2) {
      return res.status(400).json({ error: 'A kategória megadása kötelező és legalább 2 karakteres.' });
    }

    const imageUrl = req.file ? req.file.path : '';


    const newProduct = new Product({
      name: name.trim(),
      description: description?.trim() || '',
      price: parsedPrice,
      category: category.trim(),
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

    
    if (req.file) {
  
      product.imageUrl = req.file.path;
    }


    // Validált frissítések
    if (req.body.name !== undefined) {
      const name = req.body.name.trim();
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ error: 'A név 2–100 karakter hosszú legyen.' });
      }
      product.name = name;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description.trim();
    }

    if (req.body.price !== undefined) {
      const parsedPrice = Number(req.body.price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ error: 'Az ár érvényes, pozitív szám kell legyen.' });
      }
      product.price = parsedPrice;
    }

    if (req.body.category !== undefined) {
      const category = req.body.category.trim();
      if (category.length < 2) {
        return res.status(400).json({ error: 'A kategória legalább 2 karakter legyen.' });
      }
      product.category = category;
    }

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
    /*if (product.imageUrl) {
      const imageFileName = product.imageUrl.split('/uploads/products/')[1];
      if (imageFileName) {
        const filePath = path.join(__dirname, '..', 'uploads', 'products', imageFileName);
        fs.unlink(filePath, err => {
          if (err) console.error('Nem sikerült törölni a képet:', err);
        });
      }
    }*/

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
