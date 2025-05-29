import { ref } from 'vue';
import { fetchTestcases, createNewTestcase, updateExistingTestcase, deleteTestcase } from '../api/testcase';

export function useTestcase() {
  const testcases = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadTestcases = async (featureId) => {
    if (!featureId) return;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetchTestcases(featureId);
      testcases.value = response.data || [];
    } catch (err) {
      console.error('Error loading testcases:', err);
      error.value = 'Failed to load test cases. Please try again.';
      testcases.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createTestcase = async (featureId, testcaseData) => {
    if (!featureId) return null;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createNewTestcase(featureId, testcaseData);
      return response.data;
    } catch (err) {
      console.error('Error creating testcase:', err);
      error.value = 'Failed to create test case. Please try again.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTestcase = async (testcaseId, testcaseData) => {
    if (!testcaseId) return null;
    
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateExistingTestcase(testcaseId, testcaseData);
      return response.data;
    } catch (err) {
      console.error('Error updating testcase:', err);
      error.value = 'Failed to update test case. Please try again.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteTestcaseById = async (testcaseId) => {
    if (!testcaseId) return false;
    
    loading.value = true;
    error.value = null;
    
    try {
      await deleteTestcase(testcaseId);
      return true;
    } catch (err) {
      console.error('Error deleting testcase:', err);
      error.value = 'Failed to delete test case. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    testcases,
    loading,
    error,
    loadTestcases,
    createTestcase,
    updateTestcase,
    deleteTestcaseById
  };
}