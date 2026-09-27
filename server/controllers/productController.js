import { randomUUID } from 'crypto';
import {
  products,
  reviews,
  buildProductSummary,
  getPublicUser,
  syncProductRatings,
  createProductId,
} from '../data/store.js';

const sortProducts = (list, sortBy) => {
  const sorted = [...list];

  switch (sortBy) {
    case 'rating':
    case 'rating_high':
      sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0));
      return sorted;
    case 'rating_low':
      sorted.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0) || (a.reviewCount || 0) - (b.reviewCount || 0));
      return sorted;
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return sorted;
  }
};

export const getProducts = (req, res) => {
  const { category, sort } = req.query;

  let filteredProducts = [...products];

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter((product) => product.category === category);
  }

  filteredProducts = sortProducts(filteredProducts, sort || 'newest');

  return res.json({
    success: true,
    count: filteredProducts.length,
    products: filteredProducts.map((product) => buildProductSummary(product)),
  });
};

export const getProductById = (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  return res.json({ success: true, product: buildProductSummary(product) });
};

export const getProductReviews = (req, res) => {
  const productId = req.params.productId;
  const productReviews = reviews.filter((review) => review.productId === productId);

  return res.json({
    success: true,
    reviews: productReviews.map((review) => ({
      ...review,
      user: getPublicUser({ id: review.userId, name: 'Customer', email: '' }),
    })),
  });
};

export const addProductReview = (req, res) => {
  const productId = req.params.productId;
  const { rating, comment } = req.body;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
  }

  const product = products.find((item) => item.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const alreadyReviewed = reviews.some((review) => review.productId === productId && review.userId === req.user.id);
  if (alreadyReviewed) {
    return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
  }

  const review = {
    id: `rev-${randomUUID()}`,
    productId,
    userId: req.user.id,
    rating: Number(rating),
    comment: comment || '',
    createdAt: new Date().toISOString(),
  };

  reviews.push(review);
  syncProductRatings(productId);

  return res.status(201).json({ success: true, review });
};

export const createProduct = (req, res) => {
  const { name, description, category, price, images, sizes } = req.body;

  if (!name || !description || !category || !price) {
    return res.status(400).json({ success: false, message: 'Product name, description, category, and price are required.' });
  }

  const newProduct = {
    id: createProductId(),
    name,
    description,
    category,
    price: Number(price),
    images: Array.isArray(images) && images.length ? images : ['https://via.placeholder.com/900x1200?text=Product'],
    sizes: Array.isArray(sizes) && sizes.length ? sizes : [{ size: 'M', stock: 10 }],
    createdAt: new Date().toISOString(),
    averageRating: 0,
    reviewCount: 0,
  };

  products.push(newProduct);
  return res.status(201).json({ success: true, product: buildProductSummary(newProduct) });
};

export const updateProduct = (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  Object.assign(product, {
    ...product,
    ...req.body,
    price: req.body.price ? Number(req.body.price) : product.price,
    updatedAt: new Date().toISOString(),
  });

  return res.json({ success: true, product: buildProductSummary(product) });
};

export const deleteProduct = (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  products.splice(index, 1);
  for (let i = reviews.length - 1; i >= 0; i -= 1) {
    if (reviews[i].productId === req.params.id) {
      reviews.splice(i, 1);
    }
  }

  return res.json({ success: true, message: 'Product deleted successfully.' });
};
