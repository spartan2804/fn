import { ref } from 'vue';
import { fetchTeams } from '../api/team';


export function useTeam() {
  const teams = ref([]);
  const loading = ref(false);

  const loadTeams = async (product_id) => {
    loading.value = true;
    try {
      const response = await fetchTeams(product_id);
      teams.value = response.data;
      console.log('teams',teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      loading.value = false;
    }
  };
  
 
  return {
    teams,
    loading,
    loadTeams,
  };
}

