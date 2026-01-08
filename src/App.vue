<script setup>
import { ref, computed } from 'vue';
import QuestionCard from './components/QuestionCard.vue';
import ResultCard from './components/ResultCard.vue';
import FlashCard from './components/FlashCard.vue';
import questionsData from './assets/questions.json';
import definitionsData from './assets/definitions.json';

const allQuestions = questionsData;
const definitions = definitionsData;
const SERIES_SIZE = 10;

const currentSeries = ref(0);
const currentQuestionIndex = ref(0);
const score = ref(0);
const gameState = ref('menu'); // 'menu', 'playing', 'result', 'flashcards'

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

const openFlashcards = () => {
  gameState.value = 'flashcards';
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
};

const nextQuestion = () => {
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
  currentFlashcardIndex.value = 0;
};

// Flashcards Navigation
const currentFlashcardIndex = ref(0);
const currentFlashcard = computed(() => definitions[currentFlashcardIndex.value]);

const nextFlashcard = () => {
  if (currentFlashcardIndex.value < definitions.length - 1) {
    currentFlashcardIndex.value++;
  }
};

const prevFlashcard = () => {
  if (currentFlashcardIndex.value > 0) {
    currentFlashcardIndex.value--;
  }
};
</script>

<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      
    <div v-if="gameState === 'menu'" class="menu-screen" key="menu">
        <h1 class="main-title">QCM Android Expert</h1>
        <p class="subtitle">Choisissez une série de questions</p>
        
        <div class="main-actions">
          <button class="action-card glass-panel flashcards-btn" @click="openFlashcards">
            <span class="icon">📝</span>
            <span class="title">Révision Flashcards</span>
            <span class="desc">15 définitions clés à maîtriser</span>
          </button>
        </div>

        <div class="section-divider">
          <span>ou lancez un QCM</span>
        </div>

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
        @next-question="nextQuestion"
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

      <!-- Flashcards Screen -->
      <div v-else-if="gameState === 'flashcards'" class="flashcards-screen" key="flashcards">
        <h2 class="screen-title">Flashcard {{ currentFlashcardIndex + 1 }} / {{ definitions.length }}</h2>
        
        <div class="flashcard-wrapper">
          <FlashCard 
            :key="currentFlashcard.id" 
            :term="currentFlashcard.term" 
            :definition="currentFlashcard.definition"
          />
        </div>

        <div class="flashcard-controls">
          <button class="nav-btn" @click="prevFlashcard" :disabled="currentFlashcardIndex === 0">
            ← Précédent
          </button>
          <button class="nav-btn" @click="nextFlashcard" :disabled="currentFlashcardIndex === definitions.length - 1">
            Suivant →
          </button>
        </div>
      </div>
    </transition>
    
    <!-- Back to Menu Button -->
    <button v-if="gameState === 'result' || gameState === 'flashcards'" class="btn-secondary back-btn fixed-back" @click="backToMenu">
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

/* Flashcards & Menu Actions */
.main-actions {
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
}

.action-card {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.action-card:hover {
  background: rgba(99, 102, 241, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.action-card .icon {
  font-size: 2.5rem;
}

.action-card .title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  display: block;
  margin-bottom: 0.25rem;
}

.action-card .desc {
  color: #c7d2fe;
  font-size: 0.9rem;
}

.section-divider {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 1rem 0 2rem;
  color: #64748b;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.section-divider::before,
.section-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.section-divider span {
  padding: 0 1rem;
}

.flashcards-screen {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 6rem;
}

.screen-title {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 2.5rem;
  text-align: center;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.flashcards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.fixed-back {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.fixed-back:hover {
  background: rgba(30, 41, 59, 1);
  transform: translateY(-2px);
}

.flashcard-wrapper {
  width: 100%;
  max-width: 600px;
  margin-bottom: 3rem;
  /* Ensure container has decent height for the absolute positioning inside */
  display: flex;
  justify-content: center;
}

.flashcard-controls {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.nav-btn {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 99px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 640px) {
  .menu-screen {
    padding: 2rem 1rem;
  }

  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .action-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem;
  }
  
  .action-card .icon {
    margin-bottom: 0.5rem;
  }

  .screen-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .flashcards-screen {
    padding: 1rem;
    padding-bottom: 5rem;
  }

  .flashcard-wrapper {
    margin-bottom: 2rem;
  }

  .flashcard-controls {
    gap: 1rem;
    width: 100%;
  }

  .nav-btn {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .fixed-back {
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
