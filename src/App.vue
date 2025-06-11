<script setup>
import { ref, computed } from 'vue';
import PlayerSelector from './components/PlayerSelector.vue';
import Game from './components/Game.vue';

const predefinedPlayers = [
  { name: "Matt", avatar: "https://avatars.githubusercontent.com/u/12172162" },
  { name: "Darts Vador", avatar: "https://avatars.githubusercontent.com/u/8111373" },
  { name: "Cramomille", avatar: import.meta.env.BASE_URL + "img/default.jpg" },
  { name: "Feu d'artifice", avatar: "https://avatars.githubusercontent.com/u/3041254" },
  { name: "Ro", avatar: import.meta.env.BASE_URL + "img/ro.jpg" },
  { name: "Louis", avatar: import.meta.env.BASE_URL + "img/van gerwen.png" },
  { name: "Angelo", avatar: import.meta.env.BASE_URL + "img/default.jpg" },
];

const gameStarted = ref(false);
const selectedPlayers = ref([]);

// Quand on démarre le jeu, on reçoit la liste des noms de joueurs sélectionnés
function startGame(players) {
  selectedPlayers.value = players;
  gameStarted.value = true;
}

// Liste complète des joueurs sélectionnés avec leur avatar (d'après predefinedPlayers)
const selectedPlayersWithData = computed(() => 
  selectedPlayers.value.map(name => 
    predefinedPlayers.find(p => p.name === name) || { name, avatar: import.meta.env.BASE_URL + "img/default.jpg" }
  )
);
</script>

<template>
  <!-- On passe predefinedPlayers à PlayerSelector -->
  <PlayerSelector 
    v-if="!gameStarted" 
    :predefinedPlayers="predefinedPlayers"
    @start-game="startGame" 
  />
  <!-- On passe la liste enrichie à Game -->
  <Game v-else :players="selectedPlayersWithData" />
</template>