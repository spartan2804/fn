// src/composables/useProduct.js
import { ref } from 'vue';
import { fetchProducts, createProduct as apiCreateProduct } from '../api/product';

export function useProduct() {
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadProducts = async () => {
    loading.value = true;
    try {
      const response = await fetchProducts();
      products.value = response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (product_name) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiCreateProduct({ product_name });
      products.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Error creating product:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
  };
}

// This composable function manages the state and logic for fetching products.
// It uses the `fetchProducts` API function to retrieve product data and handles loading state.