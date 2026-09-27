import { carts, createCartKey, products } from '../data/store.js';
import { sanitizeQuantity, toSafeMoney } from '../utils/pricing.js';

const ensureCart = (userId) => {
  if (!carts[userId]) {
    carts[userId] = { items: [] };
  }

  return carts[userId];
};

const parseQuantity = (value) => {
  const raw = Number(value);

  if (!Number.isInteger(raw) || !Number.isFinite(raw)) {
    throw new Error('Quantity must be a positive integer.');
  }

  return sanitizeQuantity(raw);
};

export const getCart = (req, res) => {
  const cart = ensureCart(req.user.id);
  const items = cart.items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return {
      ...item,
      product: product ? { ...product, price: toSafeMoney(product.price) } : null,
    };
  });

  return res.json({ success: true, cart: items });
};

export const addCartItem = (req, res) => {
  const { productId, size, quantity = 1 } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ success: false, message: 'Product ID and size are required.' });
  }

  let normalizedQuantity;
  try {
    normalizedQuantity = parseQuantity(quantity);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  const product = products.find((item) => item.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (toSafeMoney(product.price) < 0) {
    return res.status(400).json({ success: false, message: 'Product price is invalid.' });
  }

  const sizeStock = product.sizes.find((item) => item.size === size);
  if (!sizeStock) {
    return res.status(400).json({ success: false, message: 'Selected size is not available.' });
  }

  if (sizeStock.stock <= 0) {
    return res.status(400).json({ success: false, message: 'This size is currently out of stock.' });
  }

  const cart = ensureCart(req.user.id);
  const itemId = createCartKey(productId, size);
  const existingItem = cart.items.find((item) => item.id === itemId);

  if (existingItem) {
    const updatedQty = existingItem.quantity + normalizedQuantity;
    if (updatedQty > sizeStock.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });
    }
    existingItem.quantity = updatedQty;
    return res.status(200).json({ success: true, cart: cart.items });
  }

  if (normalizedQuantity > sizeStock.stock) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });
  }

  cart.items.push({ id: itemId, productId, size, quantity: normalizedQuantity });
  return res.status(201).json({ success: true, cart: cart.items });
};

export const updateCartItem = (req, res) => {
  const { quantity } = req.body;
  const cart = ensureCart(req.user.id);
  const item = cart.items.find((entry) => entry.id === req.params.itemId);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  const product = products.find((entry) => entry.id === item.productId);
  const sizeStock = product?.sizes.find((entry) => entry.size === item.size);

  if (!product || !sizeStock) {
    return res.status(404).json({ success: false, message: 'Product is no longer available.' });
  }

  let nextQty;
  try {
    nextQty = parseQuantity(quantity);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  if (nextQty <= 0) {
    cart.items = cart.items.filter((entry) => entry.id !== req.params.itemId);
    return res.json({ success: true, cart: cart.items });
  }

  if (nextQty > sizeStock.stock) {
    return res.status(400).json({ success: false, message: 'Requested quantity exceeds stock.' });
  }

  item.quantity = nextQty;
  return res.json({ success: true, cart: cart.items });
};

export const removeCartItem = (req, res) => {
  const cart = ensureCart(req.user.id);
  const beforeCount = cart.items.length;
  cart.items = cart.items.filter((item) => item.id !== req.params.itemId);

  if (cart.items.length === beforeCount) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  return res.json({ success: true, cart: cart.items });
};
