const Order = require('../models/Order');
const Cart = require('../models/Cart');

const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId })
      .populate('items.productId')
      .populate('items.player');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'A kosár üres' });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.productId.price || 0) * item.quantity;
    }, 0);

    const order = new Order({
      userId: req.userId,
      items: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name || 'Ismeretlen termék',           // ➔ név mentése
        price: item.productId.price || 0,                            // ➔ ár mentése
        imageUrl: item.productId.imageUrl || '',                     // ➔ kép mentése
        quantity: item.quantity,
        size: item.size || '',
        player: item.player ? { _id: item.player._id, name: item.player.name } : undefined
      })),
      totalAmount
    });

    await order.save();
    const populatedOrder = await Order.findById(order._id).populate('items.productId');
    await Cart.findOneAndUpdate({ userId: req.userId }, { items: [] });

    res.status(201).json({ message: 'Rendelés sikeresen leadva', order });
  } catch (err) {
    console.error('Hiba a rendelés leadása során:', err);
    res.status(500).json({ message: 'Hiba a rendelés leadása során' });
  }
};


const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.userId }).populate('items.productId').sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Hiba a rendelések lekérdezésekor' });
    }
  };

  const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('items.productId userId').sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: 'Hiba az összes rendelés lekérdezésekor' });
    }
  };

  const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const order = await Order.findById(id).populate('items.productId userId');
      if (!order) {
        return res.status(404).json({ message: 'Rendelés nem található' });
      }
  
      order.status = status;
      await order.save();
      

      res.json(order);
    } catch (err) {
      console.error('Hiba a rendelés státusz frissítésekor:', err);
      res.status(500).json({ message: 'Hiba a rendelés állapotának frissítésekor' });
    }
  };
  

  const deleteOrder = async (req, res) => {
    const { id } = req.params;
  
    try {
      await Order.findByIdAndDelete(id);
      res.json({ message: 'Rendelés törölve' });
    } catch (err) {
      res.status(500).json({ message: 'Hiba a rendelés törlésekor' });
    }
  };

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};
