import { randomUUID } from 'crypto';
import { carts, orders, products } from '../data/store.js';
import { calculateCartTotals, sanitizeQuantity, toSafeMoney } from '../utils/pricing.js';

const paymentOptions = ['UPI', 'Card', 'Cash on Delivery'];

export const createOrder = (req, res) => {
  const { shippingAddress, paymentMethod, totalAmount: clientTotalAmount } = req.body;

  if (!shippingAddress || !shippingAddress.city || !shippingAddress.address) {
    return res.status(400).json({ success: false, message: 'Shipping address is required.' });
  }

  if (!paymentOptions.includes(paymentMethod)) {
    return res.status(400).json({ success: false, message: 'Please select a valid payment method.' });
  }

  const cart = carts[req.user.id];
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }

  let summary;
  try {
    const validItems = cart.items.map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      if (!product) {
        throw new Error('Product not found during checkout.');
      }

      const quantity = sanitizeQuantity(item.quantity);
      const sizeStock = product.sizes.find((entry) => entry.size === item.size);
      if (!sizeStock || sizeStock.stock < quantity) {
        throw new Error(`Insufficient stock for ${product.name} in size ${item.size}.`);
      }

      sizeStock.stock -= quantity;

      return {
        quantity,
        product: {
          price: toSafeMoney(product.price),
        },
      };
    });

    summary = calculateCartTotals(validItems);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unable to validate cart items.' });
  }

  if (typeof clientTotalAmount !== 'undefined') {
    const browserAmount = toSafeMoney(clientTotalAmount);
    if (Math.abs(browserAmount - summary.total) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Order total does not match the verified cart amount.',
      });
    }
  }

  const orderItems = cart.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    const validatedQuantity = sanitizeQuantity(item.quantity);

    return {
      productId: product.id,
      productName: product.name,
      size: item.size,
      quantity: validatedQuantity,
      priceAtPurchase: toSafeMoney(product.price),
    };
  });

  const newOrder = {
    id: `ord-${randomUUID()}`,
    userId: req.user.id,
    items: orderItems,
    shippingAddress,
    totalAmount: summary.total,
    paymentMethod,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  delete carts[req.user.id];

  return res.status(201).json({ success: true, order: newOrder });
};

export const getOrders = (req, res) => {
  const userOrders = orders.filter((order) => order.userId === req.user.id);
  return res.json({ success: true, orders: userOrders });
};

export const getOrderById = (req, res) => {
  const order = orders.find((entry) => entry.id === req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'You are not allowed to view this order.' });
  }

  return res.json({ success: true, order });
};
