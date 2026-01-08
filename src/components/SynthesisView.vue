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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  width: 100%;
}

.category-card {
  padding: 2rem;
  height: 100%;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 2rem; /* Increased from 1.5rem to 2rem */
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cat-icon {
  font-size: 2.5rem;
  background: rgba(99, 102, 241, 0.2);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.cat-title {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.point-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.25rem;
  transition: background 0.2s;
}

.point-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.point-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.bullet {
  color: #6366f1;
  font-size: 1.5rem;
  line-height: 0;
  display: none; /* Hide bullet in card mode */
}

.point-concept {
  color: #a5b4fc;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
}

.point-details {
  color: #cbd5e1;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
  padding-left: 0;
  white-space: pre-line;
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
