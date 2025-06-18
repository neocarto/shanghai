<template>
    <div class="scores-page">
  
      <div v-if="bestScores.length" class="players-list">
        <div v-for="(score, index) in bestScores" :key="index" class="player-card">
          <h3 class="player-name">
            <span class="medal" :class="'medal-' + index">
              <span v-if="index === 0">🥇</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else-if="index === 3">🍫</span>
            </span>
            {{ score.name }}
          </h3>
          <p class="score-text">
            Meilleur score : <b>{{ score.score }} pts</b>
            <small> ({{ formatDate(score.timestamp) }})</small>
          </p>
          <p class="score-text">
            Score moyen : <b>{{ score.average }} pts</b>
          </p>
          
        </div>
        
      </div>
  
  
      <div v-if="numberOne" class="player-card highlight">
        <h3 class="player-name highlight-name">
          {{ numberOne.name }}
        </h3>
        <p class="score-text">
          Meilleur score : <b>{{ numberOne.score }} pts</b>
          <small> ({{ formatDate(numberOne.timestamp) }})</small>
        </p>
        <p class="score-text">
          Score moyen : <b>{{ numberOne.average }} pts</b>
        </p>
      </div>
  
      <p v-if="!numberOne">Aucun score enregistré.</p>
  
      <button @click="$emit('back')" class="back-button">Retour</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../supabase';
  
  const bestScores = ref([]);
  const numberOne = ref(null);
  
  async function fetchScores() {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false });
  
    if (error) {
      console.error('Erreur de récupération des scores :', error);
      return;
    }
    if (!data.length) return;
  
    numberOne.value = data[0];
  
    const playerScoresMap = {};
    data.forEach(score => {
      if (!playerScoresMap[score.name]) {
        playerScoresMap[score.name] = [];
      }
      playerScoresMap[score.name].push(score.score);
    });
  
    const playerAverages = {};
    for (const player in playerScoresMap) {
      const scores = playerScoresMap[player];
      const total = scores.reduce((a, b) => a + b, 0);
      playerAverages[player] = (total / scores.length).toFixed(2);
    }
  
    const seen = new Set([numberOne.value.name]);
    bestScores.value = data.filter(score => {
      if (seen.has(score.name)) return false;
      seen.add(score.name);
      return true;
    }).map(score => ({
      ...score,
      average: Math.round(playerAverages[score.name])
    }));
  
    numberOne.value.average = Math.round(playerAverages[numberOne.value.name]);
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  onMounted(() => {
    fetchScores();
  });
  </script>
  
  <style scoped>
.scores-page {
  max-width: 900px;
  margin: 1.5rem auto;
  padding: 1rem 1.5rem;
  color: #13171F;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: left; /* Alignement à gauche */
  min-height: 100vh;
  box-sizing: border-box;
}

h2 {
  font-weight: 700;
  font-size: 1.6rem; /* un peu plus petit */
  margin-bottom: 2rem;
  color: #13171F;
  text-align: center; /* titre centré quand même */
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  align-items: center;
}

.player-card {
  background-color: #f8f9fa; /* Fond clair doux */
  box-shadow: 0 6px 12px rgb(0 0 0 / 0.1);
  border-radius: 14px;
  padding: 16px 20px; /* un peu moins grand */
  width: 100%;
  max-width: 480px;
  transition: box-shadow 0.3s ease;
  color: #13171F;
  text-align: left; /* aligné à gauche */
}

.player-card:hover {
  box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
}

.player-card.highlight {
  border: 2px solid #0288d1;
  max-width: 500px;
  margin: 2rem auto;
  background-color: #e3f2fd; /* bleu très clair */
  box-shadow: 0 12px 24px rgb(2 136 209 / 0.25);
  color: #13171F;
  text-align: left; /* aussi aligné à gauche */
}

.player-name {
  font-size: 1.3rem; /* plus petit */
  font-weight: 700;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #13171F;
}

.highlight-name {
  font-size: 1.4rem; /* plus petit aussi */
}

.medal {
  font-size: 1.4rem;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.medal-0 {
  color: #ffc107;
}

.medal-1 {
  color: #90a4ae;
}

.medal-2 {
  color: #ff7043;
}

.medal-3 {
  color: #6d4c41;
}

.score-text {
  font-size: 0.85rem; /* plus petit */
  margin: 0.18rem 0;
  color: #13171F;
}

.score-text small {
  font-size: 0.75rem;
  color: #555;
}

.back-button {
  margin-top: 2rem;
  padding: 0.55rem 1.4rem;
  background-color: #0288d1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.back-button:hover {
  background-color: #0277bd;
}

@media (max-width: 520px) {
  .scores-page {
    padding: 1rem 1rem;
  }

  .player-card {
    max-width: 100%;
    padding: 14px 12px;
  }

  .player-name {
    font-size: 1.1rem;
  }

  .score-text {
    font-size: 0.8rem;
  }

  .highlight-name {
    font-size: 1.2rem;
  }
}

  </style>
  