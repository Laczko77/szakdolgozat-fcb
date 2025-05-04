const Cart = require('../models/Cart');

// Kosár lekérése bejelentkezett user alapján
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Hiba a kosár lekérdezésekor' });
  }
};

// Termék hozzáadása vagy mennyiség növelése
const addToCart = async (req, res) => {
  try {
    const user = req.user;
    const { productId, quantity, size, playerId } = req.body;

    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    // Megkeressük, van-e már ilyen tétel
    const existingItem = cart.items.find(item =>
      item.productId.toString() === productId &&
      item.size === size &&
      ((item.player && playerId && item.player._id.toString() === playerId) || (!item.player && !playerId))
    );

    if (existingItem) {
      // Ha van ilyen, növeljük a mennyiséget
      existingItem.quantity += quantity;
    } else {
      // Ha nincs, új tételt adunk hozzá
      const newItem = {
        productId,
        quantity,
        size,
      };

      if (playerId) {
        newItem.player = { _id: playerId };
      }

      cart.items.push(newItem);
    }

    await cart.save();
    const populatedCart = await cart.populate([
      { path: 'items.productId' },
      { path: 'items.player' }
    ]);
    
    res.status(201).json(populatedCart);



    
  } catch (error) {
    console.error('Hiba a kosárba rakáskor:', error);
    res.status(500).json({ message: 'Hiba a kosárba rakáskor.' });
  }
};





// Termék eltávolítása a kosárból
const removeFromCart = async (req, res) => {
  try {
    const { productId, size, playerId } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Kosár nem található' });

    cart.items = cart.items.filter(item =>
      !(item.productId.toString() === productId &&
        item.size === size &&
        ((item.player && playerId && item.player._id.toString() === playerId) || (!item.player && !playerId)))
    );

    await cart.save();

    const populatedCart = await cart.populate([
      { path: 'items.productId' },
      { path: 'items.player' }
    ]);

    res.json(populatedCart);
  } catch (err) {
    console.error('Hiba a tétel törlésekor:', err);
    res.status(500).json({ message: 'Hiba a törlés során' });
  }
};


// Kosár teljes ürítése
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: 'Kosár nem található' });

    cart.items = []; // <<<< csak a tartalom törlődik
    await cart.save();

    res.json({ message: 'Kosár kiürítve' });
  } catch (err) {
    res.status(500).json({ message: 'Hiba az ürítés során' });
  }
};


const decreaseQuantity = async (req, res) => {
  try {
    const { productId, size, playerId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Kosár nem található.' });
    }

    const itemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId &&
      item.size === size &&
      ((item.player && playerId && item.player._id.toString() === playerId) || (!item.player && !playerId))
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Tétel nem található a kosárban.' });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // teljes tétel törlése
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Hiba a mennyiség csökkentésekor:', error);
    res.status(500).json({ message: 'Hiba a mennyiség csökkentésekor.' });
  }
};


module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  decreaseQuantity
};
