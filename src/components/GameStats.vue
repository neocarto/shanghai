<template>
  <div>
    <h2>Partie terminée</h2>
    <ul class="final-scores">
      <li
        v-for="(player, index) in sortedPlayers"
        :key="player.name"
        class="final-score-item"
      >
        <!-- Nom et médailles affichés toujours -->
        <!-- <div class="final-player-name-above">
          <template v-if="player.name !== robotName">
            <span v-if="humanPlayersSorted[0]?.name === player.name">🥇</span>
            <span v-else-if="humanPlayersSorted[1]?.name === player.name">🥈</span>
            <span v-else-if="humanPlayersSorted[2]?.name === player.name">🥉</span>
            <span v-else-if="humanPlayersSorted[3]?.name === player.name">🍫</span>
          </template>
          {{ player.name }}
        </div> -->

        <!-- Stats, avatar et dartboard seulement si ce n'est pas le robot -->
        <template v-if="player.name !== robotName">
          <!-- <span class="final-player-score">{{ player.totalScore }} pts</span> -->
          <img :src="player.avatar" alt="avatar" class="final-avatar-large" />

          <div class="final-player-info">
            <div class="dartboard-container" v-html="getDartboardSVG(player)"></div>
          </div>
        </template>
      </li>
    </ul>

    <p><button @click="replay">Rejouer</button></p>

    <div v-if="role === 'admin'" class="action-buttons">
      <a href="#" @click.prevent="$emit('view-scores')" class="link-button">Voir le classement</a>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '../supabase';
import { drawDartboard } from '../helpers/dartboard.js'; // adapte le chemin

const props = defineProps(['sortedPlayers', 'humanPlayersSorted', 'robotName', 'stats','role', 'site']);

// Sauvegarde des scores
async function saveScore() {
  const timestamp = Date.now();
  const insertData = props.sortedPlayers.map(d => ({
    player_id: d.id,
    name: d.name,
    timestamp: timestamp,
    score: d.totalScore,
    hits: d.scores,
    site: props.site  
  }));

  const { data, error } = await supabase
    .from('scores')
    .insert(insertData);
}

// Reload
function replay() {
  window.location.reload();
}

// Sauvegarde si admin
if (props.role === 'admin') {
  saveScore();
}

// Retourne le SVG du dartboard en string
function getDartboardSVG(player) {
  // drawDartboard peut être modifiée pour renvoyer une string SVG si nécessaire
  // ici on utilise outerHTML pour transformer le SVG en string directement
  const svg = drawDartboard(player.scores, player.name, 1000); // taille 200px
  return svg.outerHTML;
}
</script>

<style scoped>
.final-score-item {
  display: flex;
  flex-direction: column; 
  align-items: center;  
  gap: 8px;
  margin-bottom: 0px;
  padding-bottom: 12px;
 }

.final-player-name-above {
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 4px;
  text-align: center;
}

.final-player-info {
  width: 100%;
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dartboard-container {
  margin-top: 0px;
  width: 100%;
}

.final-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-bottom: 0px;
}

.final-player-score {
  font-style: italic;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  font-size: 1.1rem;
  min-width: auto;
}

.final-scores {
  list-style: none;
  padding: 0;
  margin: 0 auto;       
  max-width: 1000px;     
 
  flex-direction: column;
  align-items: center; 
  gap: 0px;           
}
</style>
