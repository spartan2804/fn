<template>
  <select @change="onSelect($event.target.value)">
    <option value="">Select Group</option>
    <option v-for="group in groups" :key="group.group_id" :value="group.group_id">
      {{ group.group_name }}
    </option>
  </select>
</template>

<script setup>
import { watch } from 'vue';
import { useGroup } from '../../composables/useGroup.js';

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:selectedGroup']);

const { groups, loadGroups } = useGroup();

const onSelect = (value) => {
  emit('update:selectedGroup', value);
};

watch(
  () => props.teamId,
  (newTeamId) => {
    if (newTeamId) {
      loadGroups(newTeamId);
    } else {
      groups.value = [];
    }
  },
  { immediate: true }
);
</script>
