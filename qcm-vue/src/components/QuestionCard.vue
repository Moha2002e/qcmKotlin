<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['submit-answer']);

const selectedIndices = ref([]);

// Reset selection when question changes
watch(() => props.question, () => {
  selectedIndices.value = [];
});

const toggleOption = (index) => {
  if (selectedIndices.value.includes(index)) {
    selectedIndices.value = selectedIndices.value.filter(i => i !== index);
  } else {
    selectedIndices.value.push(index);
  }
  selectedIndices.value.sort((a, b) => a - b);
};

const submit = () => {
  if (selectedIndices.value.length === 0) return;
  emit('submit-answer', selectedIndices.value);
};
</script>

<template>
  <div class="question-card glass-panel">
    <div class="header">
      <span class="question-badge">Question {{ questionNumber }} / {{ totalQuestions }}</span>
    </div>
    
    <h2 class="question-text">{{ question.question }}</h2>

    <div class="options-grid">
      <div 
        v-for="(option, index) in question.options" 
        :key="index"
        class="option-item"
        :class="{ 'selected': selectedIndices.includes(index) }"
        @click="toggleOption(index)"
      >
        <div class="checkbox">
          <span v-if="selectedIndices.includes(index)">✓</span>
        </div>
        <span class="option-text">{{ option }}</span>
      </div>
    </div>

    <div class="actions">
      <button 
        class="btn-primary" 
        @click="submit"
        :disabled="selectedIndices.length === 0"
        :style="{ opacity: selectedIndices.length === 0 ? 0.5 : 1, cursor: selectedIndices.length === 0 ? 'not-allowed' : 'pointer' }"
      >
        Valider
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  padding: 2.5rem;
  width: 100%;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header {
  margin-bottom: 1.5rem;
}

.question-badge {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.question-text {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.4;
  color: white;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.option-item.selected {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.option-item.selected .checkbox {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
}

.option-text {
  font-size: 1.1rem;
  color: #e2e8f0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
