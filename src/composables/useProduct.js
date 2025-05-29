// src/composables/useProduct.js
import { ref } from 'vue';
import { fetchProducts } from '../api/product';

export function useProduct() {
  const products = ref([]);
  const loading = ref(false);

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

  return {
    products,
    loading,
    loadProducts,
  };
}

// This composable function manages the state and logic for fetching products.
// It uses the `fetchProducts` API function to retrieve product data and handles loading state.