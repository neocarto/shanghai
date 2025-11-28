
<template>
  <div>
    <h2>Partie terminée</h2>
    <ul class="final-scores">
      <li
        v-for="(player, index) in sortedPlayers"
        :key="player.name"
        class="final-score-item"
      >
        <div class="final-player-name-above">
          <template v-if="player.name !== robotName">
            <span v-if="humanPlayersSorted[0]?.name === player.name">🥇</span>
            <span v-else-if="humanPlayersSorted[1]?.name === player.name">🥈</span>
            <span v-else-if="humanPlayersSorted[2]?.name === player.name">🥉</span>
            <span v-else-if="humanPlayersSorted[3]?.name === player.name">🍫</span>
          </template>
          {{ player.name }}
        </div>
        <span class="final-player-score">{{ player.totalScore }} pts</span>
        <img :src="player.avatar" alt="avatar" class="final-avatar-large" />
        
        <div class="final-player-info">




          
          
          <div class="final-player-stats">
            <span class="stat-badge">Hits : {{ stats(player).hits }}/{{ stats(player).total }}</span>
            <span class="stat-badge">Hits (F1) : {{ stats(player).hitsF1 }}/{{ stats(player).total / 3 }}</span>
            <span class="stat-badge">Hits (F2) : {{ stats(player).hitsF2 }}/{{ stats(player).total / 3 }}</span>
            <span class="stat-badge">Hits (F3) : {{ stats(player).hitsF3 }}/{{ stats(player).total / 3 }}</span>
            <span class="stat-badge">Miss : {{ stats(player).miss }}</span>
            <span class="stat-badge">Streak : {{ stats(player).strk }}</span>
            <span class="stat-badge">Streak loose : {{ stats(player).strkloose }}</span>

            <span class="stat-badge">Single : {{ stats(player).single }}</span>
            <span class="stat-badge">Double : {{ stats(player).double }}</span>
            <span class="stat-badge">Triple : {{ stats(player).triple }}</span>
            <span v-if="stats(player).shangai >= 1" class="stat-badge awsome-badge">Shangai : {{ stats(player).shangai }}</span>
            <span v-if="stats(player).ttt >= 1" class="stat-badge awsome-badge">ttt : {{ stats(player).ttt }}</span>
            <span v-if="stats(player).ddd >= 1" class="stat-badge awsome-badge">ddd : {{ stats(player).ddd }}</span>
            <span v-if="stats(player).tt >= 1" class="stat-badge awsome-badge">tt : {{ stats(player).tt }}</span>
            <span v-if="stats(player).dd >= 1" class="stat-badge awsome-badge">dd : {{ stats(player).dd }}</span>
            <span v-if="stats(player).curses >= 1" class="stat-badge awsome-badge">🤬 : {{ stats(player).curses }}</span>
          </div>
        </div>

      </li>
    </ul>
    <p><button @click="replay">Rejouer</button></p>
    <!-- <div v-if="role === 'admin'" class="action-buttons">
  <a href="https://observablehq.com/embed/910df7914b748f22@739?cells=viewof+n%2Cchart1%2Cviewof+player%2Cchart3%2Cassiduity%2Cbest%2Cwrost%2Cmean%2Csequence%2CbestShot%2Ctriples" class="link-button" target = "_blank">Voir les scores enregistrés</a>
</div> -->

<div v-if="role === 'admin'" class="action-buttons">
  <a href="#" @click.prevent="$emit('view-scores')" class="link-button">Voir le classement</a>
</div>
  </div>
</template>

<script setup>


const props = defineProps(['sortedPlayers', 'humanPlayersSorted', 'robotName', 'stats','role', 'site']);

import { supabase } from '../supabase';


async function saveScore() {
const timestamp = Date.now();
console.log(props.site)

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


function replay() {
  window.location.reload();
}


if (props.role === 'admin') {
  saveScore();
} 

</script>


<style scoped>

.final-score-item {
  display: flex;
  flex-direction: column; 
  align-items: center;  
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.final-player-name-above {
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 4px;
  text-align: center;
}

.final-player-info {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.final-player-stats {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.final-avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.final-player-score {
  font-style: italic;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  font-size: 1.1rem;
  min-width: auto;
}

.stat-badge {
  display: inline-block;
  padding: 3px 8px;
  margin: 2px 4px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fafafa;
  font-size: 0.75rem;
  color: #333;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.04);
  transition: background-color 0.3s, border-color 0.3s;
}

.final-player-score {
font-style: italic;
font-weight: bold;
min-width: 60px;
text-align: right;
}


.replay-button {
padding: 12px 24px;
font-weight: bold;
background-color: #007BFF;
color: white;
border: none;
border-radius: 6px;
cursor: pointer;
}

.replay-button:hover {
background-color: #0056b3;
}

.final-scores {
list-style: none;
padding: 0;
margin: 0 auto;       
max-width: 600px;     
display: flex;
flex-direction: column;
align-items: center; 
gap: 24px;           
}

</style>