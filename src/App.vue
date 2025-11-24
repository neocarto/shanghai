<script setup>
import { ref } from 'vue';
import PlayerSelector from './components/PlayerSelector.vue';
import Game from './components/Game.vue';
import Login from './components/Login.vue';
import ScoreList from './components/RecordedStats.vue'; 
import GameStats from './components/GameStats.vue';

const predefinedPlayersRiate = [
  { id: 1,name: "Matt" },
  { id: 2,name: "Darts Vador", avatar: import.meta.env.BASE_URL + "img/dartsvador.png" },
  { id: 3,name: "Dart Simpson", avatar: import.meta.env.BASE_URL + "img/dartsimpson.png" },
  { id: 4,name: "Robull", avatar: import.meta.env.BASE_URL + "img/ro.jpg" },
  { id: 5 ,name: "Louis CLXXX", avatar: import.meta.env.BASE_URL + "img/crown.jpeg" },
  { id: 7,name: "Cramomille", avatar: import.meta.env.BASE_URL + "img/cramomille.png" },
  { id: 8,name: "Chloé", avatar: import.meta.env.BASE_URL + "img/ponpon.png" },
];

const predefinedPlayersCondorcet = [
  { id: 1001,name: "Hugues", avatar: import.meta.env.BASE_URL + "img/default.jpeg" },
  { id: 1002,name: "Elina", avatar: import.meta.env.BASE_URL + "img/default.jpeg" },
  { id: 1003,name: "Mattia", avatar: import.meta.env.BASE_URL + "img/archi.jpg" },
];

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
