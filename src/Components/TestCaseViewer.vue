<template>
  <div class="test-case-viewer">
    <div class="viewer-header">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search test cases..."
          class="search-input"
        />
      </div>
      <div class="view-controls">
        <select v-model="itemsPerPage" class="items-per-page">
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
    </div>

    <div class="test-cases-list">
      <div v-for="testcase in paginatedTestCases" :key="testcase.tc_id" class="test-case-item">
        <div class="test-case-content">
          <h4>{{ testcase.tc_name }}</h4>
          <p>{{ testcase.description }}</p>
        </div>
        <div class="test-case-actions">
          <button @click="$emit('view', testcase)" class="action-btn view">
            <i class="fas fa-eye"></i>
          </button>
          <button @click="$emit('edit', testcase)" class="action-btn edit">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="$emit('delete', testcase.tc_id)" class="action-btn delete">
            <i class="fas fa-trash"></i>
          </button>
          <button @click="$emit('download', testcase)" class="action-btn download">
            <i class="fas fa-download"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button 
        :disabled="currentPage === 1" 
        @click="currentPage--"
        class="page-btn"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages" 
        @click="currentPage++"
        class="page-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTestcase } from '../composables/useTestcase';

const props = defineProps({
  selectedFeatureId: {
    type: [String, Number],
    required: true
  }
});

const { testcases, loading, loadTestcases } = useTestcase();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Load test cases when feature ID changes
watch(() => props.selectedFeatureId, async (newId) => {
  if (newId) {
    await loadTestcases(newId);
  }
});

// Filter test cases based on search
const filteredTestCases = computed(() => {
  return testcases.value.filter(tc => 
    tc.tc_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    tc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Pagination logic
const totalPages = computed(() => 
  Math.ceil(filteredTestCases.value.length / itemsPerPage.value)
);

const paginatedTestCases = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTestCases.value.slice(start, end);
});
</script>

<style scoped>
.test-case-viewer {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  height: 100%;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666666" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>') no-repeat 0.75rem center;
}

.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 2px 4px rgba(52,152,219,0.1);
  outline: none;
}

.view-controls select {
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
}

.test-cases-list {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-case-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #e1e1e1;
}

.test-case-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  border-color: #3498db;
}

.test-case-content {
  flex: 1;
}

.test-case-content h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.test-case-content p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.test-case-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.action-btn i {
  font-size: 1rem;
}

.action-btn.view {
  background: #e3f2fd;
  color: #2196f3;
}

.action-btn.edit {
  background: #fff3e0;
  color: #ff9800;
}

.action-btn.delete {
  background: #ffebee;
  color: #f44336;
}

.action-btn.download {
  background: #e8f5e9;
  color: #4caf50;
}

.action-btn:hover {
  transform: scale(1.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e1e1;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: white;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:not(:disabled):hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
  font-size: 0.9rem;
}
</style>


<template>
  <!-- Add Import Button in the viewer header -->
  <div class="viewer-header">
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search test cases...">
    </div>
    <div class="actions">
      <button class="import-btn" @click="showImportModal = true">
        <i class="fas fa-file-import"></i> Import Test Cases
      </button>
    </div>
  </div>

  <!-- Import Modal -->
  <div v-if="showImportModal" class="modal-overlay">
    <div class="modal-content">
      <h3>Import Test Cases</h3>
      <div class="import-form">
        <!-- Source Feature Selection -->
        <div class="source-selection">
          <h4>Select Source Feature</h4>
          <div class="dropdown-chain">
            <select v-model="sourceProduct" @change="loadSourceTeams">
              <option value="">Select Product</option>
              <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                {{ product.product_name }}
              </option>
            </select>

            <select v-if="sourceProduct" v-model="sourceTeam" @change="loadSourceGroups">
              <option value="">Select Team</option>
              <option v-for="team in sourceTeams" :key="team.team_id" :value="team.team_id">
                {{ team.team_name }}
              </option>
            </select>

            <!-- Add similar dropdowns for group, module, and feature -->
          </div>
        </div>

        <!-- Test Case Selection -->
        <div v-if="sourceFeature" class="testcase-selection">
          <h4>Select Test Cases to Import</h4>
          <div class="selection-list">
            <div v-for="tc in sourceTestcases" :key="tc.tc_id" class="selection-item">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="selectedTestcases" :value="tc.tc_id">
                <span class="checkbox-label">{{ tc.tc_name }}</span>
              </label>
              <p class="tc-description">{{ tc.description }}</p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="cancel-btn" @click="showImportModal = false">Cancel</button>
          <button 
            class="import-action-btn" 
            :disabled="!selectedTestcases.length || importing"
            @click="handleImport"
          >
            {{ importing ? 'Importing...' : `Import (${selectedTestcases.length})` }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Existing test case list content -->
</template>

<script setup>
import { ref, watch } from 'vue';
import { useProduct } from '../composables/useProduct';
import { useTeam } from '../composables/useTeam';
import { useTestcase } from '../composables/useTestcase';

// Import Modal State
const showImportModal = ref(false);
const sourceProduct = ref('');
const sourceTeam = ref('');
const sourceGroup = ref('');
const sourceModule = ref('');
const sourceFeature = ref('');
const sourceTestcases = ref([]);
const selectedTestcases = ref([]);
const importing = ref(false);

// Load source data
const { products } = useProduct();
const { teams: sourceTeams, loadTeams } = useTeam();
const { importTestcases } = useTestcase();

const loadSourceTeams = async () => {
  if (sourceProduct.value) {
    await loadTeams(sourceProduct.value);
    sourceTeam.value = '';
    sourceGroup.value = '';
    sourceModule.value = '';
    sourceFeature.value = '';
  }
};

// Add similar load functions for groups, modules, and features

const handleImport = async () => {
  importing.value = true;
  try {
    await importTestcases({
      sourceFeatureId: sourceFeature.value,
      targetFeatureId: props.selectedFeatureId,
      testcaseIds: selectedTestcases.value
    });
    showImportModal.value = false;
    selectedTestcases.value = [];
    // Refresh the test case list
    await loadTestcases(props.selectedFeatureId);
  } catch (error) {
    console.error('Error importing test cases:', error);
  } finally {
    importing.value = false;
  }
};
</script>

<style scoped>
/* Add to existing styles */

.import-btn {
  padding: 0.75rem 1.5rem;
  background: #673ab7;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.import-btn:hover {
  background: #5e35b1;
  transform: translateY(-1px);
}

.dropdown-chain {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.selection-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  padding: 1rem;
}

.selection-item {
  padding: 0.75rem;
  border-bottom: 1px solid #f1f1f1;
}

.selection-item:last-child {
  border-bottom: none;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.tc-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  padding-left: 1.5rem;
}

.import-action-btn {
  padding: 0.75rem 1.5rem;
  background: #673ab7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.import-action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>