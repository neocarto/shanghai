<script setup>
import { ref } from 'vue';

const props = defineProps({
  predefinedPlayers: Array
});

const emit = defineEmits(['start-game']);

// Players
const players = ref([]);
const newPlayer = ref("");
const predefinedPlayersNames = props.predefinedPlayers.map(d => d.name);

function addAllPlayers() {
  const allNames = props.predefinedPlayers.map(p => p.name);
  players.value = [...new Set([...players.value, ...allNames])];
  random(); 
}

function getPlayerData(name) {
  return props.predefinedPlayers.find(p => p.name === name) || { name, avatar: import.meta.env.BASE_URL + "img/default.jpg" };
}

function deletePlayer(player) {
  players.value = players.value.filter(m => m !== player);
}

function addPlayer() {
  const name = newPlayer.value.trim();
  if (name === "") return;
  players.value.push(name);
  players.value = [...new Set(players.value)];
  newPlayer.value = "";
}

const onInputChange = () => {
  addPlayer(newPlayer.value);
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
  

<h1>Shangaï 🎯</h1>
<p style="font-size: 0.8em; max-width: 100%; overflow-wrap: break-word; white-space: pre-wrap; text-align: center; margin: 0 auto; font-style: italic; padding: 0 20px;">
"Au lancer comme dans la vie, la précision vient de la constance. Chaque fléchette compte." — Von Garden
</p>

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
    <button :disabled="newPlayer.length==0" >Ajouter</button>
  </form>

  <button
  class="add-all-players-link"
  @click="addAllPlayers"
  :disabled="predefinedPlayersNames.length === 0"
  type="button"
>
  Ajouter tous les joueurs prédéfinis
</button>

  <ul class="players-grid">
    <li v-for="player in players" :key="player" class="player-card">
  <div class="avatar-placeholder">
    <img
      :src="getPlayerData(player).avatar"
      alt="avatar"
      class="avatar-img"
    />
  </div>
  <div class="player-name">{{ player }}</div>
  <div class="player-actions">
    <button @click="moveUpPlayer(player)">←</button>
    <button @click="deletePlayer(player)">❌</button>
    <button @click="moveDownPlayer(player)">→ </button>
  </div>
</li>
</ul>
<div class="action-buttons">
  <button v-if="players.length >= 2" @click="random()">Ordre aléatoire</button>
  <button v-if="players.length >= 1" @click="emit('start-game', players)">JOUER</button>
</div>
<br/>


</template>

<style scoped>

h1 {
  text-align: center;
  margin-top: 24px;
  margin-bottom: 24px;
}

.players-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 0;
  list-style: none;
  margin: 16px auto;
  max-width: 1200px;
}

.player-card {
  flex: 0 1 45%;
  max-width: 300px;
  min-width: 140px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: transparent;  /* <-- ici */
}

.add-all-players-link {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  margin: 8px auto 24px;
  display: block;
  width: fit-content;
  user-select: none;
  text-decoration: none;
  transition: color 0.2s ease;
}

.add-all-players-link:hover {
  color: #000;
  text-decoration: underline;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background-color: transparent;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  color: #444444; /* couleur neutre pour l’emoji */
  margin-top: 8px;
  border: 1px solid var(--surface-3);
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.avatar-placeholder:hover {
  box-shadow: 0 3px 8px rgba(0,0,0,0.7);
  border-color: var(--accent);
}

.avatar-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}

.player-name {
  font-weight: bold;
  font-size: 1.1rem;
  text-align: center;
  margin-top: 8px;
}

.player-actions button {
  padding: 2px 6px;
  font-size: 15px;
  min-width: 28px;
  height: 28px;
  border-radius: 15px;
  margin: 0px;
  cursor: pointer;
}

.player-actions {
  display: flex;
  justify-content: center;
  gap: 6px; /* réduit de 12px à 6px */
  margin-top: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  margin: 16px 0;
}

form input,
form button {
  width: 250px;
  padding: 10px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  cursor: pointer;
}

@media (max-width: 480px) {
  form {
    padding-left: 8px;
    padding-right: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  form input,
  form button {
    width: 100%;
    box-sizing: border-box;
    margin: 2px;     
    padding: 8px 10px;  
  }
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

</style>



