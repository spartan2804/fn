<template>
  <select @change="onSelect($event.target.value)">
    <option value="">Select Team</option>
    <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
      {{ team.team_name }}
    </option>
  </select>
</template>

<script setup>
import { watch } from 'vue';
import { useTeam } from '../../composables/useTeam';

const props = defineProps({ 
  selectedProductId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:selectedTeam']);

const { teams, loadTeams } = useTeam();

const onSelect = (value) => {
  emit('update:selectedTeam', value);
};

// Watch for changes to selectedProductId and load teams
watch(
  () => props.selectedProductId,
   (newProductId) => {
    if (newProductId) {
      loadTeams(newProductId);
    console.log("these are the teams", teams.value);
    
    } else {
      teams.value = []; // reset when no product is selected
    }
  },
  { immediate: true }
);
</script>
