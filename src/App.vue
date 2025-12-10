<script setup>
import { ref } from 'vue';
import PlayerSelector from './components/PlayerSelector.vue';
import Game from './components/Game.vue';
import Login from './components/Login.vue';
import ScoreList from './components/RecordedStats.vue'; 
import { predefinedPlayersRiate, predefinedPlayersCondorcet } from './players.js';

const user = ref(null);
const predefinedPlayers = ref([]); // tableau à passer à PlayerSelector
const selectedPlayers = ref([]);
const view = ref('login'); 

function handleLogin(data) {
  user.value = data;

  // Choix du tableau de joueurs en fonction du site
  if (data.site === 'Riate') {
    predefinedPlayers.value = predefinedPlayersRiate;
  } else if (data.site === 'Condorcet') {
    predefinedPlayers.value = predefinedPlayersCondorcet;
  } else {
    predefinedPlayers.value = [];
  }

  view.value = 'selection';
}

function startGame(playersWithAvatars) {
  selectedPlayers.value = playersWithAvatars;
  view.value = 'game';
}

function goToScores() {
  view.value = 'scores';
}

function goBackToSelection() {
  view.value = 'selection';
}
</script>

<template>
  <div>
    <Login v-if="view === 'login'" @login="handleLogin" />

    <PlayerSelector
      v-else-if="view === 'selection'"
      :predefinedPlayers="predefinedPlayers"
      :role="user.role"
      @start-game="startGame"
      @view-scores="goToScores"
    />

    <Game
      v-else-if="view === 'game'"
      :players="selectedPlayers"
      :role="user.role"
      :site="user.site"
      @view-scores="goToScores"
    />

    <ScoreList
      v-else-if="view === 'scores'"
      @back="goBackToSelection"
      @view-scores="goToScores"
    />
  </div>
</template>
