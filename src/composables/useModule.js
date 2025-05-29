import { ref} from 'vue';
import { fetchModules } from '../api/module';



export function useModule() {
  const modules = ref([]);
  const loading = ref(false);

  const loadModules = async () => {
    loading.value = true;
    try {
      const response = await fetchModules();
      modules.value = response.data;
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      loading.value = false;
    }
  };
  


  return {
    modules,
    loading,
    loadModules,
  };
}
