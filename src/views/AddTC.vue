<template>
  <div class="add-testcase-container">
    <div class="header">
      <h1>Test Case Management</h1>
      <p>Create and manage test cases for your features</p>
    </div>

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

    <div v-if="selectedFeature" class="testcase-section">
      <h2>Manage Test Cases</h2>
      <TestcaseManager :selected-feature-id="selectedFeature" />
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
import TestcaseManager from '../Components/TestcaseManager.vue';

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
</script>

<style scoped>
.add-testcase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.selection-panel {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.selection-breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.selection-breadcrumb span {
  color: #95a5a6;
  font-weight: 500;
}

.selection-breadcrumb span.active {
  color: #3498db;
  font-weight: 600;
}

.selection-breadcrumb .separator {
  margin: 0 0.5rem;
  color: #bdc3c7;
}

.dropdown-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.dropdown-container {
  flex: 1;
  min-width: 200px;
}

.dropdown-container label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e;
}

.testcase-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.testcase-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #ecf0f1;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #34495e;
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
