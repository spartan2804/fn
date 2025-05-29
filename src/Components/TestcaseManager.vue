<template>
  <div class="testcase-manager">
    <div class="search-section">
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input 
          v-model="searchQuery" 
          placeholder="Search test cases..." 
          class="search-input"
        />
      </div>
      <button @click="toggleAddMode" class="add-button">
        <i class="fas fa-plus"></i> {{ isAddingMultiple ? 'Cancel' : 'Add Test Cases' }}
      </button>
    </div>

    <!-- Existing Test Cases List -->
    <div v-if="!isAddingMultiple" class="testcase-list">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <span>Loading test cases...</span>
      </div>
      
      <div v-else-if="filteredTestcases.length === 0" class="empty-list">
        <i class="fas fa-clipboard-list empty-icon"></i>
        <p>No test cases found. Add your first test case!</p>
      </div>
      
      <div v-else class="testcase-cards">
        <div 
          v-for="testcase in filteredTestcases" 
          :key="testcase.tc_id" 
          class="testcase-card"
        >
          <div class="testcase-header">
            <h3>{{ testcase.tc_name }}</h3>
            <div class="testcase-actions">
              <button @click="editTestcase(testcase)" class="action-button edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDelete(testcase.tc_id)" class="action-button delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p class="testcase-description">{{ testcase.description || 'No description provided' }}</p>
        </div>
      </div>
    </div>

    <!-- Single Test Case Form -->
    <div v-if="isEditing && !isAddingMultiple" class="testcase-form">
      <h3>{{ form.tc_id ? 'Edit Test Case' : 'Add New Test Case' }}</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="tc_name">Test Case Name</label>
          <input 
            id="tc_name"
            v-model="form.tc_name" 
            placeholder="Enter test case name" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="form.description" 
            placeholder="Enter test case description"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="cancelEdit" class="cancel-button">Cancel</button>
          <button type="submit" class="submit-button">
            {{ form.tc_id ? 'Update' : 'Create' }} Test Case
          </button>
        </div>
      </form>
    </div>

    <!-- Multiple Test Cases Form -->
    <div v-if="isAddingMultiple" class="multiple-testcases">
      <h3>Add Multiple Test Cases</h3>
      
      <div 
        v-for="(testcase, index) in multipleTestcases" 
        :key="index" 
        class="multiple-testcase-item"
      >
        <div class="testcase-number">{{ index + 1 }}</div>
        <div class="multiple-testcase-form">
          <div class="form-group">
            <label :for="`tc_name_${index}`">Test Case Name</label>
            <input 
              :id="`tc_name_${index}`"
              v-model="testcase.tc_name" 
              placeholder="Enter test case name" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label :for="`description_${index}`">Description</label>
            <textarea 
              :id="`description_${index}`"
              v-model="testcase.description" 
              placeholder="Enter test case description"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <button 
          v-if="multipleTestcases.length > 1" 
          @click="removeTestcase(index)" 
          class="remove-button"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="multiple-actions">
        <button @click="addAnotherTestcase" class="add-another-button">
          <i class="fas fa-plus"></i> Add Another Test Case
        </button>
        
        <div class="form-actions">
          <button @click="toggleAddMode" class="cancel-button">Cancel</button>
          <button @click="submitMultipleTestcases" class="submit-button">
            Submit All Test Cases
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this test case? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button @click="deleteTestcase(testcaseToDelete)" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTestcase } from '../composables/useTestcase';

const props = defineProps({
  featureId: {
    type: String,
    required: true,
  },
});

const { testcases, loadTestcases, createTestcase, updateTestcase, deleteTestcaseById } = useTestcase();
const searchQuery = ref('');
const loading = ref(false);
const isEditing = ref(false);
const isAddingMultiple = ref(false);
const showDeleteModal = ref(false);
const testcaseToDelete = ref(null);

const form = ref({
  tc_id: null,
  tc_name: '',
  description: '',
});

const multipleTestcases = ref([
  { tc_name: '', description: '' }
]);

const filteredTestcases = computed(() =>
  testcases.value.filter((tc) => 
    tc.tc_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (tc.description && tc.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
);

// Load test cases when component mounts or feature ID changes
onMounted(() => {
  loadTestcases(props.featureId);
});

watch(() => props.featureId, (newId) => {
  if (newId) {
    loadTestcases(newId);
  }
});

const editTestcase = (testcase) => {
  form.value = { ...testcase };
  isEditing.value = true;
  isAddingMultiple.value = false;
};

const cancelEdit = () => {
  form.value = { tc_id: null, tc_name: '', description: '' };
  isEditing.value = false;
};

const confirmDelete = (tc_id) => {
  testcaseToDelete.value = tc_id;
  showDeleteModal.value = true;
};

const deleteTestcase = async (tc_id) => {
  showDeleteModal.value = false;
  loading.value = true;
  try {
    await deleteTestcaseById(tc_id);
    await loadTestcases(props.featureId);
  } catch (error) {
    console.error('Error deleting test case:', error);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  loading.value = true;
  try {
    if (form.value.tc_id) {
      await updateTestcase(form.value.tc_id, form.value);
    } else {
      await createTestcase(props.featureId, form.value);
    }
    form.value = { tc_id: null, tc_name: '', description: '' };
    isEditing.value = false;
    await loadTestcases(props.featureId);
  } catch (error) {
    console.error('Error submitting test case:', error);
  } finally {
    loading.value = false;
  }
};

const toggleAddMode = () => {
  isAddingMultiple.value = !isAddingMultiple.value;
  if (!isAddingMultiple.value) {
    multipleTestcases.value = [{ tc_name: '', description: '' }];
  }
  isEditing.value = false;
};

const addAnotherTestcase = () => {
  multipleTestcases.value.push({ tc_name: '', description: '' });
};

const removeTestcase = (index) => {
  multipleTestcases.value.splice(index, 1);
};

const submitMultipleTestcases = async () => {
  loading.value = true;
  try {
    // Filter out empty test cases
    const validTestcases = multipleTestcases.value.filter(tc => tc.tc_name.trim() !== '');
    
    // Create all test cases in sequence
    for (const testcase of validTestcases) {
      await createTestcase(props.featureId, testcase);
    }
    
    // Reset form and reload
    multipleTestcases.value = [{ tc_name: '', description: '' }];
    isAddingMultiple.value = false;
    await loadTestcases(props.featureId);
  } catch (error) {
    console.error('Error submitting multiple test cases:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.testcase-manager {
  width: 100%;
}

.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-button {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #2980b9;
}

.testcase-list {
  margin-bottom: 2rem;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #7f8c8d;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-list {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.testcase-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.testcase-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.testcase-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testcase-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.testcase-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.testcase-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #7f8c8d;
  transition: color 0.2s, background-color 0.2s;
}

.action-button.edit:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.action-button.delete:hover {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.testcase-description {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.testcase-form, .multiple-testcases {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-button {
  background-color: #3498db;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #2980b9;
}

.cancel-button {
  background-color: #f5f6f7;
  color: #7f8c8d;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e8e8e8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button {
  background-color: #ecf0f1;
  color: #7f8c8d;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #dfe6e9;
}

.submit-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #27ae60;
}

.multiple-testcase-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
}

.testcase-number {
  width: 30px;
  height: 30px;
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.multiple-testcase-form {
  flex: 1;
}

.remove-button {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.add-another-button {
  background-color: #f8f9fa;
  color: #3498db;
  border: 1px dashed #3498db;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s;
}

.add-another-button:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

.multiple-actions {
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>
