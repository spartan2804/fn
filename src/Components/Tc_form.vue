<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="TC_name" placeholder="Test Case Name" />
    <input v-model="TC_description" placeholder="Description" />
    <input v-model="relative_path" placeholder="tv/ssc/2024/filename.cpp" />
    <input type="file" @change="handleFile" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useTestCase } from '@/composables/useTestCase';

const TC_name = ref('');
const TC_description = ref('');
const relative_path = ref('');
const file = ref(null);

const { createTC } = useTestCase();

const handleFile = (e) => {
  file.value = e.target.files[0];
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('TC_name', TC_name.value);
  formData.append('TC_description', TC_description.value);
  formData.append('relative_path', relative_path.value);
  formData.append('file', file.value);

  await createTC(formData);
};
</script>
