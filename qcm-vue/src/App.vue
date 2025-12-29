<script setup>
import { ref, computed } from 'vue';
import QuestionCard from './components/QuestionCard.vue';
import ResultCard from './components/ResultCard.vue';
import questionsData from './assets/questions.json';

const questions = ref(questionsData);
const currentQuestionIndex = ref(0);
const score = ref(0);
const gameState = ref('start'); // 'start', 'playing', 'result'

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

const startQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  gameState.value = 'playing';
};

const handleAnswer = (selectedIndices) => {
  const correctIndices = currentQuestion.value.correctAnswers.slice().sort((a, b) => a - b);
  const userIndices = selectedIndices.slice().sort((a, b) => a - b);

  const isCorrect = JSON.stringify(correctIndices) === JSON.stringify(userIndices);

  if (isCorrect) {
    score.value++;
  }

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    gameState.value = 'result';
  }
};

const retryQuiz = () => {
  startQuiz();
};
</script>

<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      <!-- Start Screen -->
      <div v-if="gameState === 'start'" class="start-screen glass-panel" key="start">
        <h1 class="main-title">QCM Android Expert</h1>
        <p class="subtitle">Testez vos connaissances en Android et Kotlin</p>
        <div class="info-badges">
          <div class="badge">
            <span class="icon">📝</span>
            <span>{{ questions.length }} Questions</span>
          </div>
          <div class="badge">
            <span class="icon">⏱️</span>
            <span>Temps illimité</span>
          </div>
        </div>
        <button class="btn-primary start-btn" @click="startQuiz">Commencer le Quiz</button>
      </div>

      <!-- Playing Screen -->
      <QuestionCard 
        v-else-if="gameState === 'playing'"
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="questions.length"
        @submit-answer="handleAnswer"
        key="playing"
      />

      <!-- Result Screen -->
      <ResultCard 
        v-else-if="gameState === 'result'"
        :score="score"
        :total="questions.length"
        @retry="retryQuiz"
        key="result"
      />
    </transition>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
}

.start-screen {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-size: 3rem;
  background: linear-gradient(to right, #fff, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.25rem;
  margin-bottom: 3rem;
}

.info-badges {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e2e8f0;
}

.start-btn {
  font-size: 1.2rem;
  padding: 1rem 3rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
