<template>
  <select @change="onSelect($event.target.value)">
    <option value="">Select Feature</option>
    <option v-for="feature in features" :key="feature.feature_id" :value="feature.feature_id">
      {{ feature.feature_name }}
    </option>
  </select>
</template>

<script setup>
import { watch } from 'vue';
import { useFeature } from '../../composables/useFeature.js';

const props = defineProps({
  moduleId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['update:selectedFeature']);

const { features, loadFeatures } = useFeature();

const onSelect = (value) => {
  emit('update:selectedFeature', value);
};

watch(
  () => props.moduleId,
  (newModuleId) => {
    if (newModuleId) {
      loadFeatures(newModuleId);
    } else {
      features.value = [];
    }
  },
  { immediate: true }
);
</script>
