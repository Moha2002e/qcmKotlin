<script setup>
import { ref, computed } from 'vue';
import QuestionCard from './components/QuestionCard.vue';
import ResultCard from './components/ResultCard.vue';
import questionsData from './assets/questions.json';

const allQuestions = questionsData;
const SERIES_SIZE = 20;

const currentSeries = ref(0);
const currentQuestionIndex = ref(0);
const score = ref(0);
const gameState = ref('menu'); // 'menu', 'playing', 'result'

// Get questions for the selected series
const currentSeriesQuestions = computed(() => {
  const start = (currentSeries.value - 1) * SERIES_SIZE;
  const end = Math.min(start + SERIES_SIZE, allQuestions.length);
  return allQuestions.slice(start, end);
});

const currentQuestion = computed(() => currentSeriesQuestions.value[currentQuestionIndex.value]);

const totalSeries = computed(() => Math.ceil(allQuestions.length / SERIES_SIZE));

const selectSeries = (seriesNumber) => {
  currentSeries.value = seriesNumber;
  startQuiz();
};

const userAnswers = ref([]);

const startQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  userAnswers.value = [];
  gameState.value = 'playing';
};

const handleAnswer = (selectedIndices) => {
  const correctIndices = currentQuestion.value.correctAnswers.slice().sort((a, b) => a - b);
  const userIndices = selectedIndices.slice().sort((a, b) => a - b);

  // Store user's answer
  userAnswers.value.push(selectedIndices);

  const isCorrect = JSON.stringify(correctIndices) === JSON.stringify(userIndices);

  if (isCorrect) {
    score.value++;
  }

  if (currentQuestionIndex.value < currentSeriesQuestions.value.length - 1) {
    currentQuestionIndex.value++;
  } else {
    gameState.value = 'result';
  }
};

const retryQuiz = () => {
  startQuiz();
};

const backToMenu = () => {
  gameState.value = 'menu';
  currentSeries.value = 0;
  score.value = 0;
  currentQuestionIndex.value = 0;
  userAnswers.value = [];
};
</script>

<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      
      <div v-if="gameState === 'menu'" class="menu-screen" key="menu">
        <h1 class="main-title">QCM Android Expert</h1>
        <p class="subtitle">Choisissez une série de questions</p>
        
        <div class="series-grid">
          <button 
            v-for="i in totalSeries" 
            :key="i" 
            class="series-card glass-panel"
            @click="selectSeries(i)"
          >
            <span class="series-number">Série {{ i }}</span>
            <span class="series-info">{{ Math.min((i * SERIES_SIZE), allQuestions.length) - ((i-1) * SERIES_SIZE) }} Questions</span>
          </button>
        </div>
      </div>

      <!-- Playing Screen -->
      <QuestionCard 
        v-else-if="gameState === 'playing'"
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="currentSeriesQuestions.length"
        @submit-answer="handleAnswer"
        key="playing"
      />

      <!-- Result Screen -->
      <ResultCard 
        v-else-if="gameState === 'result'"
        :score="score"
        :total="currentSeriesQuestions.length"
        :questions="currentSeriesQuestions"
        :user-answers="userAnswers"
        @retry="retryQuiz"
        key="result"
      />
    </transition>
    
    <!-- Back to Menu Button (visible in Result) -->
     <button v-if="gameState === 'result'" class="btn-secondary back-btn" @click="backToMenu">
      Retour au Menu
    </button>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-screen {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.main-title {
  font-size: 3rem;
  background: linear-gradient(to right, #fff, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
  text-align: center;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.25rem;
  margin-bottom: 3rem;
  text-align: center;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 800px;
}

.series-card {
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.series-card:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: translateY(-5px);
  border-color: #6366f1;
}

.series-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.series-info {
  color: #a5b4fc;
  font-size: 0.9rem;
}

.back-btn {
  margin-top: 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
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
