<script setup>
import { ref } from 'vue';
import PlayerSelector from './components/PlayerSelector.vue';
import Game from './components/Game.vue';
import Login from './components/Login.vue';

const predefinedPlayers = [
  { name: "Matt" },
  { name: "Darts Vador", avatar: import.meta.env.BASE_URL + "img/dartsvador.png" },
  { name: "Cramomille" },
  { name: "Feu d'artifice" },
  { name: "Robull", avatar: import.meta.env.BASE_URL + "img/ro.jpg" },
  { name: "Louis CLXXX", avatar: import.meta.env.BASE_URL + "img/crown.jpeg" },
  { name: "Angelo" },
];

const user = ref(null);
const gameStarted = ref(false);
const selectedPlayers = ref([]);

function startGame(playersWithAvatars) {
  selectedPlayers.value = playersWithAvatars;
  gameStarted.value = true;
}

function handleLogin(data) {
  user.value = data;
}
</script>

<template>
  <div>
    <Login v-if="!user" @login="handleLogin" />

    <div v-else>
      <PlayerSelector 
        v-if="!gameStarted" 
        :predefinedPlayers="predefinedPlayers"
        :role="user.role"
        @start-game="startGame" 
      />
      <Game 
        v-else 
        :players="selectedPlayers" 
        :role="user.role" 
      />
    </div>
  </div>
</template>
