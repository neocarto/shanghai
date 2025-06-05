<script setup>
import { ref } from 'vue';

// Players
const players = ref([]);
const newPlayer = ref("");
const predefinedPlayers = [{name: 'Matthieu'}, {name:"Darts Vador"}, {name:"Cramomille"}, {name:"Feu d'artifice"}]
const predefinedPlayersNames = predefinedPlayers.map(d => d.name);

function deletePlayer(player) {
players.value = players.value.filter(m => m !== player);
}

function addPlayer() {
  const name = newPlayer.value.trim();
  if (name === "") return;
players.value.push(name) ;
players.value = [...new Set(players.value)]
newPlayer.value = ""; }

const onInputChange = () => {
  addPlayer(newPlayer.value)
}

function moveUpPlayer(value) {
  const index = players.value.indexOf(value);
  if (index <= 0) return players.value; 
  [players.value[index - 1], players.value[index]] = [players.value[index], players.value[index - 1]];
  return players.value;
}

function moveDownPlayer(value) {
  const index = players.value.indexOf(value);
  if (index === -1 || index >= players.value.length - 1) return players.value;
  [players.value[index], players.value[index + 1]] = [players.value[index + 1], players.value[index]];
  return players.value;
}

function random() {
  players.value.sort((a,b) => a>b ? -1 : 1);
  for (let i = players.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players.value[i], players.value[j]] = [players.value[j], players.value[i]];
  }
}





</script>

<template>

<h1>Liste des joueurs</h1>



<form @submit.prevent="addPlayer(newPlayer)">
    <input
      type="text"
      v-model="newPlayer"
      list="playerOptions"
      placeholder="Ajouter un joueur"
      @change="onInputChange"
    />
    <datalist id="playerOptions">
      <option v-for="player in predefinedPlayersNames" :key="player" :value="player" />
    </datalist>
    <button type="submit">Ajouter</button>
  </form>

  <ul class="players-grid">
  <li v-for="player in players" :key="player" class="player-card">
    <div class="avatar-placeholder">
      <!-- Remplace par une vraie <img> plus tard -->
      <span>👤</span>
    </div>
    <div class="player-name">{{ player }}</div>
    <div class="player-actions">
      <button @click="moveUpPlayer(player)">🠐</button>
      <button @click="deletePlayer(player)">❌</button>
      <button @click="moveDownPlayer(player)">🠒</button>

    </div>
  </li>
</ul>
<p><button @click="random()">Ordre aléatoire</button></p>
<p><button>JOUER</button></p>


</template>

<style scoped>
.players-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0;
  list-style: none;
}

.player-card {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  margin-top: 8px;
}

.player-name {
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-top: 8px;
}

.player-actions {
  display: flex;
  gap: 6px;
}
</style>



