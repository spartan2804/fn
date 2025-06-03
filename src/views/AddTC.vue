<template>
  <div class="add-testcase-container">
    <div class="header">
      <h1>Test Case Management</h1>
      <p>Create and manage test cases for your features</p>
    </div>

    <!-- Selection Panel (Top) -->
    <div class="selection-panel">
      <div class="selection-breadcrumb">
        <span :class="{ active: selectedProduct }">Product</span>
        <span class="separator">›</span>
        <span :class="{ active: selectedTeam }">Team</span>
        <span class="separator">›</span>
        <span :class="{ active: selectedGroup }">Group</span>
        <span class="separator">›</span>
        <span :class="{ active: selectedModule }">Module</span>
        <span class="separator">›</span>
        <span :class="{ active: selectedFeature }">Feature</span>
      </div>

      <div class="dropdown-section">
        <div class="dropdown-container">
          <label>Select Product</label>
          <ProductDropdown @update:selectedProduct="onProductSelect" />
        </div>

        <div class="dropdown-container" v-if="selectedProduct">
          <label>Select Team</label>
          <TeamDropdown :selected-product-id="selectedProduct" @update:selectedTeam="onTeamSelect" />
        </div>

        <div class="dropdown-container" v-if="selectedTeam">
          <label>Select Group</label>
          <GroupDropdown :selected-team-id="selectedTeam" @update:selectedGroup="onGroupSelect" />
        </div>

        <div class="dropdown-container" v-if="selectedGroup">
          <label>Select Module</label>
          <ModuleDropdown :selected-group-id="selectedGroup" @update:selectedModule="onModuleSelect" />
        </div>

        <div class="dropdown-container" v-if="selectedModule">
          <label>Select Feature</label>
          <FeatureDropdown :selected-module-id="selectedModule" @update:selectedFeature="onFeatureSelect" />
        </div>
      </div>
    </div>

    <!-- Two-Column Layout -->
    <div v-if="selectedFeature" class="content-layout">
      <!-- Left Column: Test Case Viewer -->
      <div class="left-column">
        <TestCaseViewer 
          :selected-feature-id="selectedFeature"
          @edit="onEditTestCase"
          @delete="onDeleteTestCase"
          @view="onViewTestCase"
          @download="onDownloadTestCase"
        />
      </div>

      <!-- Right Column: Add TC Form -->
      <div class="right-column">
        <AddTCForm 
          :selected-feature-id="selectedFeature"
          @testcase-added="refreshTestCases"
        />
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-clipboard-list"></i>
      </div>
      <h3>Select a feature to manage test cases</h3>
      <p>Navigate through the dropdowns above to select a feature</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductDropdown from '../Components/Dropdowns/ProductDropdown.vue';
import TeamDropdown from '../Components/Dropdowns/TeamDropdown.vue'; 
import GroupDropdown from '../Components/Dropdowns/GroupDropdown.vue';
import ModuleDropdown from '../Components/Dropdowns/ModuleDropdown.vue';
import FeatureDropdown from '../Components/Dropdowns/FeatureDropdown.vue';
import TestCaseViewer from '../Components/TestCaseViewer.vue';
import AddTCForm from '../Components/AddTCForm.vue';

const selectedProduct = ref(null);
const selectedTeam = ref(null);
const selectedGroup = ref(null);
const selectedModule = ref(null);
const selectedFeature = ref(null);

const onProductSelect = (id) => {
  selectedProduct.value = id;
  selectedTeam.value = null;
  selectedGroup.value = null;
  selectedModule.value = null;
  selectedFeature.value = null;
};

const onTeamSelect = (id) => {
  selectedTeam.value = id;
  selectedGroup.value = null;
  selectedModule.value = null;
  selectedFeature.value = null;
};

const onGroupSelect = (id) => {
  selectedGroup.value = id;
  selectedModule.value = null;
  selectedFeature.value = null;
};

const onModuleSelect = (id) => {
  selectedModule.value = id;
  selectedFeature.value = null;
};

const onFeatureSelect = (id) => {
  selectedFeature.value = id;
};

const onEditTestCase = (testcase) => {
  // Handle edit action
};

const onDeleteTestCase = (testcaseId) => {
  // Handle delete action
};

const onViewTestCase = (testcase) => {
  // Handle view action
};

const onDownloadTestCase = (testcase) => {
  // Handle download action
};

const refreshTestCases = () => {
  // Refresh the test cases list
};
</script>

<style scoped>
.add-testcase-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(120deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.selection-panel {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.selection-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 10px;
  overflow-x: auto;
}

.selection-breadcrumb span {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s ease;
}

.selection-breadcrumb span.active {
  background: #3498db;
  color: white;
  box-shadow: 0 2px 4px rgba(52,152,219,0.2);
}

.selection-breadcrumb .separator {
  color: #ccc;
  margin: 0 0.25rem;
}

.dropdown-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
}

.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-container label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.dropdown-container select {
  padding: 0.75rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  cursor: pointer;
}

.dropdown-container select:hover {
  border-color: #3498db;
  box-shadow: 0 2px 4px rgba(52,152,219,0.1);
}

.content-layout {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 3rem;
  color: #3498db;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #666;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}

.slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
