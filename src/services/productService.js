import api from './api';

export const getAllProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const searchProducts = (keyword) => api.get(`/products/search?keyword=${keyword}`);
export const getProductsByCategory = (categoryId) => api.get(`/products/category/${categoryId}`);
export const getProductsByBrand = (brandId) => api.get(`/products/brand/${brandId}`);
export const createProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);