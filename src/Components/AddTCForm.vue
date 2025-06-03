<template>
  <div class="add-tc-form">
    <h3>Add Test Case</h3>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="tc_name">Test Case Name</label>
        <input 
          id="tc_name"
          v-model="form.tc_name" 
          type="text" 
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description"
          v-model="form.description" 
          rows="4"
          class="form-input"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="file">Upload File</label>
        <div class="file-upload">
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".xls,.xlsx,.xml,.pdf,.docx"
            class="file-input"
          />
          <p class="file-info" v-if="selectedFile">
            Selected: {{ selectedFile.name }}
          </p>
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Test Case' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTestcase } from '../composables/useTestcase';

const props = defineProps({
  selectedFeatureId: {
    type: [String, Number],
    required: true
  }
});

const emit = defineEmits(['testcase-added']);

const form = ref({
  tc_name: '',
  description: ''
});

const selectedFile = ref(null);
const loading = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // Here you can add logic to parse the file and auto-fill form fields
    // based on the file content
  }
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('tc_name', form.value.tc_name);
    formData.append('description', form.value.description);
    if (selectedFile.value) {
      formData.append('file', selectedFile.value);
    }
    formData.append('feature_id', props.selectedFeatureId);

    // Add API call to create test case with formData
    // await createTestCase(formData);

    // Reset form
    form.value = {
      tc_name: '',
      description: ''
    };
    selectedFile.value = null;
    
    emit('testcase-added');
  } catch (error) {
    console.error('Error creating test case:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-tc-form {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  height: 100%;
}

.add-tc-form h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f1f1;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  border-color: #3498db;
  box-shadow: 0 2px 4px rgba(52,152,219,0.1);
  outline: none;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.file-upload {
  border: 2px dashed #e1e1e1;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8f9fa;
  cursor: pointer;
}

.file-upload:hover {
  border-color: #3498db;
  background: #f1f7fb;
}

.file-upload input[type="file"] {
  display: none;
}

.file-upload::before {
  content: '📎 Choose a file or drag it here';
  color: #666;
  font-size: 1rem;
}

.file-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  color: #2196f3;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-btn {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52,152,219,0.2);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@keyframes loading {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.submit-btn:disabled {
  background: linear-gradient(270deg, #f1f1f1, #e1e1e1, #f1f1f1);
  background-size: 200% 200%;
  animation: loading 2s ease infinite;
}
</style>