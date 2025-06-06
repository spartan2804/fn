import { ref } from 'vue';
import { fetchFeatures } from '../api/feature';



export function useFeature() {
  const features = ref([]);
  const loading = ref(false);

  const loadFeatures = async (module_id) => {
    loading.value = true;
    try {
      const response = await fetchFeatures(module_id);
      features.value = response.data;
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      loading.value = false;
    }
  };
  


  return {
    features,
    loading,
    loadFeatures,
  };
}
