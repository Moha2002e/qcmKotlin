<script setup>
import { ref, watch, computed } from 'vue';

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

const emit = defineEmits(['submit-answer', 'next-question']);

const selectedIndices = ref([]);
const isSubmitted = ref(false);
const shuffledOptions = ref([]);

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Initialize and shuffle options when question changes
watch(() => props.question, (newQuestion) => {
  selectedIndices.value = [];
  isSubmitted.value = false;
  if (newQuestion && newQuestion.options) {
      const opts = newQuestion.options.map((text, idx) => ({ text, originalIndex: idx }));
      shuffledOptions.value = shuffleArray(opts);
  } else {
      shuffledOptions.value = [];
  }
}, { immediate: true });

const toggleOption = (index) => {
  if (isSubmitted.value) return; // Disable changes after submit

  if (selectedIndices.value.includes(index)) {
    selectedIndices.value = selectedIndices.value.filter(i => i !== index);
  } else {
    selectedIndices.value.push(index);
  }
  selectedIndices.value.sort((a, b) => a - b);
};

const isOptionCorrect = (index) => {
  return props.question.correctAnswers?.includes(index) || false;
};

const isOptionSelected = (index) => {
  return selectedIndices.value.includes(index);
};

const getOptionClass = (index) => {
  if (!isSubmitted.value) {
    return isOptionSelected(index) ? 'selected' : '';
  }

  // Logic for submitted state
  if (isOptionCorrect(index)) {
    return 'correct'; // Show green for correct answers
  }
  if (isOptionSelected(index) && !isOptionCorrect(index)) {
    return 'incorrect'; // Show red for wrong user selection
  }
  return 'dimmed'; // Dim other options
};
const submit = () => {
  if (selectedIndices.value.length === 0) return;
  isSubmitted.value = true;
  emit('submit-answer', selectedIndices.value);
};

const next = () => {
  emit('next-question');
};

const isCorrectGlobal = computed(() => {
    if (!props.question?.correctAnswers) return false;
    const correct = props.question.correctAnswers.slice().sort((a, b) => a - b);
    const user = selectedIndices.value.slice().sort((a, b) => a - b);
    return JSON.stringify(correct) === JSON.stringify(user);
});
</script>

<template>
  <div class="question-card glass-panel">
    <div class="header">
      <span class="question-badge">Question {{ questionNumber }} / {{ totalQuestions }}</span>
    </div>
    
    <h2 class="question-text">{{ question.question }}</h2>

    <div class="options-grid">
      <div 
        v-for="(optionObj, index) in shuffledOptions" 
        :key="optionObj.originalIndex"
        class="option-item"
        :class="getOptionClass(optionObj.originalIndex)"
        @click="toggleOption(optionObj.originalIndex)"
      >
        <div class="checkbox">
            <span v-if="isSubmitted && isOptionCorrect(optionObj.originalIndex)">✓</span>
            <span v-else-if="isSubmitted && isOptionSelected(optionObj.originalIndex) && !isOptionCorrect(optionObj.originalIndex)">✕</span>
            <span v-else-if="isOptionSelected(optionObj.originalIndex)">✓</span>
        </div>
        <span class="option-text">{{ optionObj.text }}</span>
      </div>
    </div>

    <!-- Feedback Section -->
    <div v-if="isSubmitted" class="feedback-section" :class="isCorrectGlobal ? 'success' : 'error'">
        <div class="feedback-header">
            <span class="feedback-icon">{{ isCorrectGlobal ? 'Correct !' : 'Incorrect' }}</span>
        </div>
        <p class="feedback-explanation">
            {{ question.explanation || "Pas d'explication disponible." }}
        </p>
    </div>

    <div class="actions">
      <button 
        v-if="!isSubmitted"
        class="btn-primary" 
        @click="submit"
        :disabled="selectedIndices.length === 0"
        :style="{ opacity: selectedIndices.length === 0 ? 0.5 : 1, cursor: selectedIndices.length === 0 ? 'not-allowed' : 'pointer' }"
      >
        Valider
      </button>
      <button 
        v-else
        class="btn-primary" 
        @click="next"
      >
        {{ questionNumber === totalQuestions ? 'Voir les résultats' : 'Question Suivante' }} →
      </button>
    </div>
  </div>
</template>

<style scoped>
.question-card {
  padding: 2.5rem;
  width: 100%;
  max-width: 800px; /* Limit width for readability */
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

.option-item:not(.correct):not(.incorrect):hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.option-item.selected {
  background: rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.option-item.correct {
  background: rgba(34, 197, 94, 0.15);
  border-color: #22c55e;
}

.option-item.incorrect {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
}

.option-item.dimmed {
  opacity: 0.5;
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
  flex-shrink: 0;
}

.option-item.selected .checkbox {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
}

.option-item.correct .checkbox {
  background: #22c55e;
  border-color: #22c55e;
  color: white;
}

.option-item.incorrect .checkbox {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.option-text {
  font-size: 1.1rem;
  color: #e2e8f0;
}

.feedback-section {
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid;
    animation: fadeIn 0.3s ease;
}

.feedback-section.success {
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.3);
}

.feedback-section.error {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
}

.feedback-header {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.feedback-section.success .feedback-header { color: #4ade80; }
.feedback-section.error .feedback-header { color: #f87171; }

.feedback-explanation {
    color: #e2e8f0;
    line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .question-card {
    padding: 1.5rem;
  }

  .question-text {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .question-badge {
    font-size: 0.75rem;
  }
  
  .option-item {
    padding: 0.75rem;
  }

  .option-text {
    font-size: 1rem;
  }

  .feedback-section {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
}
</style>
