// src/hooks/useLocalStorage.js
import { useEffect, useState } from 'react';
import localStorageService from '../services/localStorageService';

export const useLocalStorage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data
    localStorageService.initializeData();
    const allData = localStorageService.getData();
    setData(allData);
    setLoading(false);
  }, []);

  return {
    loading,
    data,
    ...localStorageService
  };
};

// Specific hooks for different data types
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cats = localStorageService.getCategories();
    setCategories(cats);
    setLoading(false);
  }, []);

  return { categories, loading };
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prods = localStorageService.getProducts();
    setProducts(prods);
    setLoading(false);
  }, []);

  return { products, loading };
};

export const useCart = () => {
  const [cart, setCart] = useState({ items: [], grandTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cartData = localStorageService.getCart();
    setCart(cartData);
    setLoading(false);
  }, []);

  const addItem = (productId, quantity) => {
    const updatedCart = localStorageService.addToCart(productId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const removeItem = (productId) => {
    const updatedCart = localStorageService.removeFromCart(productId);
    setCart(updatedCart);
    return updatedCart;
  };

  const updateItem = (productId, quantity) => {
    const updatedCart = localStorageService.updateCartItemQuantity(productId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const clear = () => {
    const updatedCart = localStorageService.clearCart();
    setCart(updatedCart);
    return updatedCart;
  };

  return { cart, loading, addItem, removeItem, updateItem, clear };
};