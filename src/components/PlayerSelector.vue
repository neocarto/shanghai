<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const props = defineProps({
  predefinedPlayers: Array,
  role: String
});

const emit = defineEmits(['start-game']);
const players = ref([]);
const newPlayer = ref("");

// Avatars par défaut
const defaultAvatars = [
  import.meta.env.BASE_URL + "img/invite_1.jpg",
  import.meta.env.BASE_URL + "img/invite_2.png",
  import.meta.env.BASE_URL + "img/invite_3.png",
  import.meta.env.BASE_URL + "img/invite_4.png",
  import.meta.env.BASE_URL + "img/invite_5.png",
  import.meta.env.BASE_URL + "img/invite_6.png",
  import.meta.env.BASE_URL + "img/invite_7.png",
  import.meta.env.BASE_URL + "img/invite_8.png",
  import.meta.env.BASE_URL + "img/invite_9.png",
  import.meta.env.BASE_URL + "img/invite_10.png",
  import.meta.env.BASE_URL + "img/invite_11.png",
];
let unusedDefaultAvatars = [...defaultAvatars];

function getRandomDefaultAvatar() {
  if (unusedDefaultAvatars.length === 0) {
    unusedDefaultAvatars = [...defaultAvatars];
  }
  const index = Math.floor(Math.random() * unusedDefaultAvatars.length);
  return unusedDefaultAvatars.splice(index, 1)[0];
}

function addPlayer() {
  const name = newPlayer.value.trim();
  if (name === "") return;
  if (players.value.some(p => p.name === name)) return;

  const found = props.predefinedPlayers.find(p => p.name === name);
  players.value.push({
    name,
    avatar: found?.avatar || getRandomDefaultAvatar()
  });

  newPlayer.value = "";
}

function onInputChange() {
  addPlayer();
}

function addAllPlayers() {
  players.value = props.predefinedPlayers.map(p => ({
    id:p.id,
    name: p.name,
    avatar: p.avatar || getRandomDefaultAvatar()
  }));
}

function deletePlayer(name) {
  players.value = players.value.filter(p => p.name !== name);
}

function moveUpPlayer(name) {
  const index = players.value.findIndex(p => p.name === name);
  if (index <= 0) return;
  [players.value[index - 1], players.value[index]] = [players.value[index], players.value[index - 1]];
}

function moveDownPlayer(name) {
  const index = players.value.findIndex(p => p.name === name);
  if (index === -1 || index >= players.value.length - 1) return;
  [players.value[index + 1], players.value[index]] = [players.value[index], players.value[index + 1]];
}

function random() {
  for (let i = players.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players.value[i], players.value[j]] = [players.value[j], players.value[i]];
  }
}

function goFullScreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function startGame() {
  goFullScreen();
  emit('start-game', players.value);
}

onMounted(() => {
  if (props.role === 'admin') {
    addAllPlayers();
  }
});
</script>

<template>
  <h1>Shangaï 🎯</h1>
  <div v-if="role === 'admin'" class="action-buttons">
  <a href="#" @click.prevent="$emit('view-scores')" class="link-button">Voir les scores enregistrés</a>
</div>


  <form @submit.prevent="addPlayer">
    <input
      type="text"
      v-model="newPlayer"
      placeholder="Ajouter un joueur"
      @change="onInputChange"
    />
    <button :disabled="newPlayer.length === 0">Ajouter</button>
  </form>

  <ul class="players-grid">
    <li v-for="player in players" :key="player.name" class="player-card">
      <div class="avatar-placeholder">
        <img :src="player.avatar" alt="avatar" class="avatar-img" />
      </div>
      <div class="player-name">{{ player.name }}</div>
      <div class="player-actions">
        <button @click="moveUpPlayer(player.name)">&#8592;</button>
        <button @click="deletePlayer(player.name)">❌</button>
        <button @click="moveDownPlayer(player.name)">&#8594;</button>
      </div>
    </li>
  </ul>

  <div class="action-buttons">
    <button v-if="players.length >= 2" @click="random()">Ordre aléatoire</button>
    <button v-if="players.length >= 1" @click="startGame" class="jouer-button">JOUER</button>
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
  background: transparent;  
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
  color: #444444;
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
  gap: 6px;
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


.jouer-button {
  background-color: #e91e63;
  font-weight: bold;
}
</style>
