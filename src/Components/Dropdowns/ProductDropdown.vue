<template>
  <div class="dropdown-wrapper">
    <select @change="onSelect($event.target.value)" :disabled="loading">
      <option value="">{{ loading ? 'Loading...' : 'Select Product' }}</option>
      <option v-for="product in products" :key="product.product_id" :value="product.product_id">
        {{ product.product_name }} ({{ product.product_id }})
      </option>
    </select>
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProduct } from '../../composables/useProduct';

const emit = defineEmits(['update:selectedProduct']);
const { products, loadProducts } = useProduct();
const loading = ref(false);

const onSelect = (value) => {
  emit('update:selectedProduct', value);
};

onMounted(async () => {
  loading.value = true;
  try {
    await loadProducts();
    console.log('Products loaded:', products.value);
    
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dropdown-wrapper {
  position: relative;
}

select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  color: #2c3e50;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
}

select:hover {
  border-color: #3498db;
}

select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

select:disabled {
  background-color: #f5f6f7;
  cursor: not-allowed;
}

.loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
