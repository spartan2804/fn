<template>
  <div class="dropdown-wrapper">
    <div class="select-container">
      <select @change="onSelect($event.target.value)" :disabled="loading">
        <option value="">Select Product</option>
        <option v-for="product in products" :key="product.product_id" :value="product.product_id">
          {{ product.product_name }}
        </option>
      </select>
      <button class="create-btn" @click="showCreateModal = true">
        <i class="fas fa-plus"></i>
      </button>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Create New Product</h3>
        <form @submit.prevent="handleCreate">
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="newProduct.name" required type="text" placeholder="Enter product name">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newProduct.description" placeholder="Enter description"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showCreateModal = false">Cancel</button>
            <button type="submit" class="submit-btn" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useProduct } from '../../composables/useProduct';

const showCreateModal = ref(false);
const creating = ref(false);
const newProduct = ref({
  name: '',
  description: ''
});

const { products, loading, loadProducts, createProduct } = useProduct();

const handleCreate = async () => {
  creating.value = true;
  try {
    await createProduct(newProduct.value);
    showCreateModal.value = false;
    newProduct.value = { name: '', description: '' };
    await loadProducts(); // Refresh list
  } catch (error) {
    console.error('Error creating product:', error);
  } finally {
    creating.value = false;
  }
};

const emit = defineEmits(['update:selectedProduct']);
// const { products, loadProducts } = useProduct();
// const loading = ref(false);

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

.select-container {
  display: flex;
  gap: 0.5rem;
}

.create-btn {
  padding: 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-btn:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #f1f1f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
