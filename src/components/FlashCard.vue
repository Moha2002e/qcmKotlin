<script setup>
import { ref } from 'vue';

const props = defineProps({
  term: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  }
});

const isFlipped = ref(false);

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
};
</script>

<template>
  <div class="flashcard-container" @click="toggleFlip">
    <div class="flashcard" :class="{ 'is-flipped': isFlipped }">
      <div class="card-face card-front">
        <h3>{{ term }}</h3>
        <span class="hint">(Cliquer pour retourner)</span>
      </div>
      <div class="card-face card-back">
        <p>{{ definition }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  height: 220px;
  cursor: pointer;
}

.flashcard {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  border-radius: 16px;
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-front {
  background: rgba(30, 41, 59, 0.7); /* Slate-800 with opacity */
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  color: #f8fafc;
}

.card-back {
  background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); /* Indigo to Purple gradient */
  color: white;
  transform: rotateY(180deg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.hint {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
}

p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .flashcard-container {
    height: 280px; /* More height for potentially long definitions on narrow screens */
  }

  h3 {
    font-size: 1.1rem;
  }

  p {
    font-size: 0.9rem;
  }
  
  .card-face {
    padding: 1rem;
  }
}
</style>
