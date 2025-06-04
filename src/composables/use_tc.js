import { ref } from 'vue';
import { uploadTestCase, updateTestCase, deleteTestCase } from '@/apiHandler';

export const useTestCase = () => {
  const loading = ref(false);
  const error = ref(null);

  const createTC = async (formData) => {
    try {
      loading.value = true;
      await uploadTestCase(formData);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const editTC = async (id, formData) => {
    try {
      loading.value = true;
      await updateTestCase(id, formData);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const deleteTC = async (id) => {
    try {
      loading.value = true;
      await deleteTestCase(id);
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  return { createTC, editTC, deleteTC, loading, error };
};
