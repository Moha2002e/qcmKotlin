<script setup>
import { ref } from 'vue';

const props = defineProps({
  synthesisData: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="synthesis-container">
    <h2 class="main-title-small">Synthèse Technique</h2>
    <p class="subtitle-small">L'essentiel à retenir pour l'examen</p>
    
    <div class="categories-masonry">
      <div v-for="(cat, index) in synthesisData" :key="index" class="category-card glass-panel">
        <div class="cat-header">
          <span class="cat-icon">{{ cat.icon }}</span>
          <h3 class="cat-title">{{ cat.category }}</h3>
        </div>
        
        <div class="points-list">
          <div v-for="(point, pIndex) in cat.points" :key="pIndex" class="point-item">
            <div class="point-header">
                <span class="bullet">•</span>
                <span class="point-concept">{{ point.concept }}</span>
            </div>
            <p class="point-details">{{ point.details }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.synthesis-container {
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  padding-bottom: 6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title-small {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 800;
}

.subtitle-small {
  color: #94a3b8;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.categories-masonry {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
}

.category-card {
  padding: 2rem;
  height: 100%;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(99, 102, 241, 0.3);
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cat-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.1);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.cat-title {
  font-size: 1.5rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.point-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.point-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.bullet {
  color: #6366f1;
  font-size: 1.2rem;
  line-height: 1;
}

.point-concept {
  color: #a5b4fc;
  font-weight: 700;
  font-size: 1.1rem;
}

.point-details {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  padding-left: 1.25rem;
  white-space: pre-line; /* Allows newlines in JSON */
}

@media (max-width: 640px) {
  .categories-masonry {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .category-card {
    padding: 1.5rem;
  }

  .main-title-small {
    font-size: 2rem;
  }
}
</style>
