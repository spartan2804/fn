<template>
  <select @change="onSelect($event.target.value)">
    <option value="">Select Module</option>
    <option v-for="module in modules" :key="module.module_id" :value="module.module_id">
      {{ module.module_name }}
    </option>
  </select>
</template>

<script setup>
import { watch } from 'vue';
import { useModule } from '../../composables/useModule.js';

const props = defineProps({
  selectedGroupId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:selectedModule']);

const { modules, loadModules } = useModule();

const onSelect = (value) => {
  emit('update:selectedModule', value);
};

watch(
  () => props.selectedGroupId,
  (newGroupId) => {
    if (newGroupId) {
      loadModules(newGroupId);
    } else {
      modules.value = [];
    }
  },
  { immediate: true }
);
</script>
