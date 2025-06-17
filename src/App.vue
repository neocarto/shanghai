<script setup>
import { ref, computed } from 'vue';
import PlayerSelector from './components/PlayerSelector.vue';
import Game from './components/Game.vue';
import Login from './components/Login.vue';

const predefinedPlayers = [
  { name: "Matt", avatar: "https://avatars.githubusercontent.com/u/12172162" },
  { name: "Darts Vador", avatar: import.meta.env.BASE_URL + "img/dartsvador.png" },
  { name: "Cramomille", avatar: import.meta.env.BASE_URL + "img/default.jpg" },
  { name: "Feu d'artifice", avatar: "https://avatars.githubusercontent.com/u/3041254" },
  { name: "Ro", avatar: import.meta.env.BASE_URL + "img/ro.jpg" },
  { name: "Louis CLXXX", avatar: import.meta.env.BASE_URL + "img/crown.jpeg" },
  { name: "Angelo", avatar: import.meta.env.BASE_URL + "img/default.jpg" },
];

const user = ref(null);  // utilisateur connecté
const gameStarted = ref(false);
const selectedPlayers = ref([]);

// Quand on démarre le jeu, on reçoit la liste des noms de joueurs sélectionnés
function startGame(players) {
  selectedPlayers.value = players;
  gameStarted.value = true;
}

// Gestion du login
function handleLogin(data) {
  user.value = data;
}

// Liste complète des joueurs sélectionnés avec leur avatar (d'après predefinedPlayers)
const selectedPlayersWithData = computed(() => 
  selectedPlayers.value.map(name => 
    predefinedPlayers.find(p => p.name === name) || { name, avatar: import.meta.env.BASE_URL + "img/default.jpg" }
  )
);
</script>

<template>
  <div>
    <Login v-if="!user" @login="handleLogin" />
    
    <div v-else>
      <!-- <p style="text-align:center">Connecté en tant que <strong>{{ user.name }}</strong></p> -->

      <PlayerSelector 
  v-if="!gameStarted" 
  :predefinedPlayers="predefinedPlayers"
  :role="user.role"
  @start-game="startGame" 
/>
      <Game v-else :players="selectedPlayersWithData" :role="user.role" />
    </div>
  </div>
</template>