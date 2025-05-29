import { ref} from 'vue';
import { fetchGroups } from '../api/group';



export function useGroup() {
  const groups = ref([]);
  const loading = ref(false);

  const loadGroups = async (team_id) => {
    loading.value = true;
    try {
      const response = await fetchGroups(team_id);
      groups.value = response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      loading.value = false;
    }
  };
  

  return {
    groups,
    loading,
    loadGroups,
  };
}
