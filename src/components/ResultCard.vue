<script setup>
import { computed, ref } from 'vue';
import { jsPDF } from 'jspdf';

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  userAnswers: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['retry']);

const showCorrection = ref(false);

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

const isAnswerCorrect = (questionIndex, userIndices) => {
  const correctIndices = props.questions[questionIndex].correctAnswers.slice().sort((a, b) => a - b);
  const uIndices = userIndices.slice().sort((a, b) => a - b);
  return JSON.stringify(correctIndices) === JSON.stringify(uIndices);
};

const generatePDF = () => {
  const doc = new jsPDF();
  const marginLeft = 20;
  let yPos = 20;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Synthèse QCM Android Expert", 105, yPos, { align: "center" });
  yPos += 15;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Score de la session : ${props.score}/${props.total} (${percentage.value}%)`, 105, yPos, { align: "center" });
  yPos += 15;

  props.questions.forEach((q, index) => {
    // Check page break
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    
    // Simple word wrap logic for questions
    const splitTitle = doc.splitTextToSize(`${index + 1}. ${q.question}`, 170);
    doc.text(splitTitle, marginLeft, yPos);
    yPos += (splitTitle.length * 5) + 2;

    q.options.forEach((opt, optIndex) => {
       const isCorrect = q.correctAnswers.includes(optIndex);
       if (isCorrect) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 128, 0); // Green for correct
       } else {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
       }
       
       const prefix = String.fromCharCode(65 + optIndex);
       const splitOpt = doc.splitTextToSize(`${prefix}. ${opt}`, 160);
       doc.text(splitOpt, marginLeft + 5, yPos);
       yPos += (splitOpt.length * 5);
    });
    
    doc.setTextColor(0, 0, 0); // Reset color
    yPos += 5; // Spacing between questions
  });

  doc.save("synthese-qcm-android.pdf");
};
</script>

<template>
  <div class="result-container">
    <div class="result-card glass-panel" v-if="!showCorrection">
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

      <div class="action-buttons">
        <button class="btn-primary" @click="$emit('retry')">
          Recommencer
        </button>
        <button class="btn-secondary" @click="showCorrection = true">
          Voir la Correction
        </button>
        <button class="btn-secondary" @click="generatePDF">
          📄 Télécharger la Synthèse
        </button>
      </div>
    </div>

    <!-- Correction View -->
    <div class="correction-view" v-else>
      <div class="correction-header glass-panel">
        <h2>Correction</h2>
        <div class="header-actions">
           <button class="btn-secondary small" @click="generatePDF">📄 PDF</button>
           <button class="btn-secondary small" @click="showCorrection = false">Retour</button>
        </div>
      </div>
      
      <div class="correction-list">
        <div 
          v-for="(q, index) in questions" 
          :key="index" 
          class="correction-item glass-panel"
          :class="{ 'correct': isAnswerCorrect(index, userAnswers[index]), 'wrong': !isAnswerCorrect(index, userAnswers[index]) }"
        >
          <div class="q-header">
            <span class="q-number">Q{{ index + 1 }}</span>
            <span class="status-icon">{{ isAnswerCorrect(index, userAnswers[index]) ? '✅' : '❌' }}</span>
          </div>
          <p class="q-text">{{ q.question }}</p>
          
          <div class="options-list">
            <div 
              v-for="(opt, optIndex) in q.options" 
              :key="optIndex"
              class="opt-item"
              :class="{
                'is-correct': q.correctAnswers.includes(optIndex),
                'is-user-selected': userAnswers[index].includes(optIndex),
                'is-missed': q.correctAnswers.includes(optIndex) && !userAnswers[index].includes(optIndex),
                'is-wrong': userAnswers[index].includes(optIndex) && !q.correctAnswers.includes(optIndex)
              }"
            >
              <span class="opt-bullet">{{ String.fromCharCode(65 + optIndex) }}.</span>
              <span class="opt-text">{{ opt }}</span>
              <span v-if="q.correctAnswers.includes(optIndex)" class="badge-correct">Réponse attendue</span>
              <span v-if="userAnswers[index].includes(optIndex) && !q.correctAnswers.includes(optIndex)" class="badge-wrong">Votre choix</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  width: 100%;
  max-width: 800px;
}

.result-card {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.8s ease-out;
}

.correction-view {
  width: 100%;
  animation: fadeIn 0.5s ease;
}

.correction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  position: sticky;
  top: 20px;
  z-index: 10;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.correction-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.correction-item {
  padding: 1.5rem;
  text-align: left;
  border-left: 4px solid transparent;
}

.correction-item.correct {
  border-left-color: var(--success-color);
}

.correction-item.wrong {
  border-left-color: var(--error-color);
}

.q-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #94a3b8;
}

.q-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: white;
}

.opt-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #cbd5e1;
}

.opt-item.is-correct {
  background: rgba(34, 197, 94, 0.1);
  color: #4ade80;
  font-weight: 500;
}

.opt-item.is-wrong {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  text-decoration: line-through;
}

.badge-correct {
  font-size: 0.7rem;
  background: #22c55e;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
}

.badge-wrong {
  font-size: 0.7rem;
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
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

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-secondary.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .result-card {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .message {
    font-size: 1rem;
  }

  .score-container {
    width: 120px;
  }

  .action-buttons {
    width: 100%;
  }

  .correction-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    position: relative; /* Unstick header on mobile to save space or keep sticky with background */
    top: 0;
  }
  
  .correction-header h2 {
    font-size: 1.5rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .correction-item {
    padding: 1rem;
  }
}
</style>
