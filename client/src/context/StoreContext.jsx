import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const StoreContext = createContext();

const tokenKey = 'clothing_store_token';
const userKey = 'clothing_store_user';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(userKey) || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || '');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setCart([]);
      return;
    }

    api
      .get('/cart')
      .then((response) => setCart(response.data.cart || []))
      .catch(() => setCart([]));
  }, [token]);

  const fetchProducts = async (category = 'all', sort = 'newest') => {
    setLoading(true);
    try {
      const response = await api.get('/products', { params: { category, sort } });
      setProducts(response.data.products || []);
      return response.data.products || [];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authToken = response.data.token;
    const authUser = response.data.user;
    localStorage.setItem(tokenKey, authToken);
    localStorage.setItem(userKey, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const authToken = response.data.token;
    const authUser = response.data.user;
    localStorage.setItem(tokenKey, authToken);
    localStorage.setItem(userKey, JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setToken('');
    setUser(null);
    setCart([]);
  };

  const fetchOrders = async () => {
    if (!token) return [];
    const response = await api.get('/orders');
    setOrders(response.data.orders || []);
    return response.data.orders || [];
  };

  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) {
      throw new Error('Login required to add items to cart.');
    }

    const response = await api.post('/cart', { productId, size, quantity });
    setCart(response.data.cart || []);
    return response.data;
  };

  const updateCartItem = async (itemId, quantity) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    setCart(response.data.cart || []);
    return response.data;
  };

  const removeCartItem = async (itemId) => {
    const response = await api.delete(`/cart/${itemId}`);
    setCart(response.data.cart || []);
    return response.data;
  };

  const checkout = async (shippingAddress, paymentMethod) => {
    const response = await api.post('/orders', { shippingAddress, paymentMethod });
    setCart([]);
    setOrders((prev) => [response.data.order, ...prev]);
    return response.data;
  };

  const value = useMemo(
    () => ({
      products,
      setProducts,
      fetchProducts,
      user,
      token,
      cart,
      orders,
      loading,
      login,
      register,
      logout,
      fetchOrders,
      addToCart,
      updateCartItem,
      removeCartItem,
      checkout,
      api,
    }),
    [products, user, token, cart, orders, loading]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return context;
}
