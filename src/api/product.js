// src/api/product.js
import axios from './axios';

export const fetchProducts = () => axios.get('/products/');
export const createProduct = (data) => axios.post('/api/product/create-product', data);
