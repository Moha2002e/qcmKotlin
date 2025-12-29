<script setup>
import { computed } from 'vue';

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['retry']);

const percentage = computed(() => Math.round((props.score / props.total) * 100));

const feedbackTitle = computed(() => {
  if (percentage.value >= 80) return "Excellent !";
  if (percentage.value >= 50) return "Bien joué !";
  return "Peut mieux faire...";
});

const feedbackMessage = computed(() => {
  if (percentage.value >= 80) return "Vous maîtrisez le sujet.";
  if (percentage.value >= 50) return "Vous avez de bonnes bases.";
  return "Il faut revoir quelques concepts.";
});

const circleDasharray = computed(() => {
  return `${percentage.value}, 100`;
});
</script>

<template>
  <div class="result-card glass-panel">
    <div class="score-container">
      <svg viewBox="0 0 36 36" class="circular-chart primary">
        <path class="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path class="circle"
          :stroke-dasharray="percentage + ', 100'"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" class="percentage">{{ percentage }}%</text>
      </svg>
    </div>

    <h2 class="title">{{ feedbackTitle }}</h2>
    <p class="message">{{ feedbackMessage }}</p>
    <p class="score-text">Note : {{ score }} / {{ total }}</p>

    <button class="btn-primary retry-btn" @click="$emit('retry')">
      Recommencer le Quiz
    </button>
  </div>
</template>

<style scoped>
.result-card {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.score-container {
  width: 150px;
  margin-bottom: 2rem;
}

.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke: var(--primary-color);
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% { stroke-dasharray: 0 100; }
}

.percentage {
  fill: white;
  font-family: var(--font-family);
  font-weight: bold;
  font-size: 0.5em;
  text-anchor: middle;
}

.title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: white;
}

.message {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.score-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #c7d2fe;
  margin-bottom: 2.5rem;
}

.retry-btn {
  width: 100%;
  max-width: 300px;
}
</style>
