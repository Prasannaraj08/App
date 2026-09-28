import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export const products = [
  {
    id: 'prod-1',
    name: 'Classic Black T-Shirt',
    description: 'A versatile cotton tee designed for everyday comfort and a sharp casual look.',
    category: 'men',
    price: 799,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 6 },
    ],
    createdAt: '2024-01-10T00:00:00.000Z',
    averageRating: 4.5,
    reviewCount: 2,
  },
  {
    id: 'prod-2',
    name: 'Summer Floral Dress',
    description: 'Lightweight and feminine, perfect for warm days and breezy evenings.',
    category: 'women',
    price: 1499,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 9 },
      { size: 'M', stock: 13 },
      { size: 'L', stock: 8 },
    ],
    createdAt: '2024-02-04T00:00:00.000Z',
    averageRating: 4.8,
    reviewCount: 3,
  },
  {
    id: 'prod-3',
    name: 'Kids Adventure Hoodie',
    description: 'A soft, cozy hoodie built for active days and cool evenings.',
    category: 'children',
    price: 1199,
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: '4Y', stock: 7 },
      { size: '6Y', stock: 10 },
      { size: '8Y', stock: 11 },
      { size: '10Y', stock: 9 },
    ],
    createdAt: '2024-03-15T00:00:00.000Z',
    averageRating: 4.6,
    reviewCount: 2,
  },
  {
    id: 'prod-4',
    name: 'Classic Tailored Blazer',
    description: 'Premium tailored men blazer structured for comfort, sharp aesthetics, and versatile styling.',
    category: 'men',
    price: 2199,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 7 },
      { size: 'XL', stock: 4 },
    ],
    createdAt: '2024-01-22T00:00:00.000Z',
    averageRating: 4.3,
    reviewCount: 1,
  },
  {
    id: 'prod-5',
    name: 'Luna Knit Sweater',
    description: 'Chunky knit silhouette created for chilly mornings and layered outfits.',
    category: 'women',
    price: 1899,
    images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 5 },
    ],
    createdAt: '2024-04-09T00:00:00.000Z',
    averageRating: 4.7,
    reviewCount: 2,
  },
  {
    id: 'prod-6',
    name: 'Playtime Cotton Set',
    description: 'A soft two-piece set with easy movement and cheerful color for kids.',
    category: 'children',
    price: 1399,
    images: ['https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80'],
    sizes: [
      { size: '4Y', stock: 6 },
      { size: '6Y', stock: 8 },
      { size: '8Y', stock: 9 },
      { size: '10Y', stock: 7 },
    ],
    createdAt: '2024-05-10T00:00:00.000Z',
    averageRating: 4.1,
    reviewCount: 1,
  },
];

export const reviews = [
  { id: 'rev-1', productId: 'prod-1', userId: 'user-admin', rating: 5, comment: 'Excellent fit and quality.', createdAt: '2024-01-15T00:00:00.000Z' },
  { id: 'rev-2', productId: 'prod-1', userId: 'user-demo', rating: 4, comment: 'Very comfortable and easy to style.', createdAt: '2024-02-02T00:00:00.000Z' },
  { id: 'rev-3', productId: 'prod-2', userId: 'user-admin', rating: 5, comment: 'Beautiful color and material.', createdAt: '2024-02-13T00:00:00.000Z' },
  { id: 'rev-4', productId: 'prod-2', userId: 'user-demo', rating: 5, comment: 'Perfect for an evening out.', createdAt: '2024-03-01T00:00:00.000Z' },
  { id: 'rev-5', productId: 'prod-2', userId: 'user-demo-2', rating: 4, comment: 'Loved the design.', createdAt: '2024-04-20T00:00:00.000Z' },
  { id: 'rev-6', productId: 'prod-3', userId: 'user-admin', rating: 5, comment: 'Warm and durable.', createdAt: '2024-03-19T00:00:00.000Z' },
  { id: 'rev-7', productId: 'prod-3', userId: 'user-demo', rating: 4, comment: 'Great for everyday wear.', createdAt: '2024-03-27T00:00:00.000Z' },
  { id: 'rev-8', productId: 'prod-4', userId: 'user-admin', rating: 4, comment: 'Stylish and lightweight.', createdAt: '2024-04-05T00:00:00.000Z' },
  { id: 'rev-9', productId: 'prod-5', userId: 'user-admin', rating: 5, comment: 'Soft knit and premium feel.', createdAt: '2024-05-01T00:00:00.000Z' },
  { id: 'rev-10', productId: 'prod-5', userId: 'user-demo', rating: 4, comment: 'Lovely look and fit.', createdAt: '2024-05-15T00:00:00.000Z' },
  { id: 'rev-11', productId: 'prod-6', userId: 'user-admin', rating: 4, comment: 'Comfortable and vibrant.', createdAt: '2024-05-22T00:00:00.000Z' },
];

const adminPasswordHash = await bcrypt.hash('admin123', 10);

export const users = [
  {
    id: 'user-admin',
    name: 'Admin User',
    email: 'admin@store.com',
    passwordHash: adminPasswordHash,
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user-demo',
    name: 'Demo Customer',
    email: 'demo@store.com',
    passwordHash: await bcrypt.hash('demo123', 10),
    role: 'customer',
    createdAt: '2024-02-02T00:00:00.000Z',
  },
];

export const carts = {};
export const orders = [];

export const syncProductRatings = (productId) => {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const productReviews = reviews.filter((review) => review.productId === productId);
  const total = productReviews.reduce((sum, review) => sum + review.rating, 0);

  product.averageRating = productReviews.length ? Number((total / productReviews.length).toFixed(1)) : 0;
  product.reviewCount = productReviews.length;
};

products.forEach((product) => syncProductRatings(product.id));

export const getPublicUser = (user) => {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
};

export const buildProductSummary = (product) => ({
  ...product,
  availableSizes: product.sizes.filter((size) => size.stock > 0).map((size) => size.size),
});

export const createCartKey = (productId, size) => `${productId}-${size}`;

export const createOrderId = () => `ord-${randomUUID()}`;

export const createProductId = () => `prod-${randomUUID()}`;
