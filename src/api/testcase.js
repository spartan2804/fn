import axios from 'axios';

// Replace with your actual API base URL
const API_URL = 'http://localhost:3000/api';

export const fetchTestcases = async (featureId) => {
  return axios.get(`${API_URL}/features/${featureId}/testcases`);
};

export const createNewTestcase = async (featureId, testcaseData) => {
  return axios.post(`${API_URL}/features/${featureId}/testcases`, testcaseData);
};

export const updateExistingTestcase = async (testcaseId, testcaseData) => {
  return axios.put(`${API_URL}/testcases/${testcaseId}`, testcaseData);
};

export const deleteTestcase = async (testcaseId) => {
  return axios.delete(`${API_URL}/testcases/${testcaseId}`);
};

export const getTestcase = async (testcaseId) => {
  return axios.get(`${API_URL}/testcases/${testcaseId}`);
};

export const bulkCreateTestcases = async (featureId, testcases) => {
  return axios.post(`${API_URL}/features/${featureId}/testcases/bulk`, { testcases });
};

export const searchTestcases = async (featureId, searchQuery) => {
  return axios.get(`${API_URL}/features/${featureId}/testcases/search`, {
    params: { query: searchQuery }
  });
};

export const getTestcaseStats = async (featureId) => {
  return axios.get(`${API_URL}/features/${featureId}/testcases/stats`);
};