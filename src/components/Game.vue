<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';


// Avoid scroll on mobile
let startY = 0;

function onTouchStart(e) {
  startY = e.touches[0].clientY;
}

function onTouchMove(e) {
  const currentY = e.touches[0].clientY;
  if (window.scrollY === 0 && currentY > startY) {
    e.preventDefault();
  }
}

onMounted(() => {
  window.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
});

// Play
const nb = 20;

const props = defineProps({
  players: Array
});

const currentRound = ref(1);
const currentPlayerIndex = ref(0);
const darts = ref([0, 0, 0]);
const robotName = 'Number One';
const robotAvatar = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';
let topScore = 0


watch(
  () => props.players.length,
  (newLength) => {
    const robotIndex = props.players.findIndex(p => p.name === robotName);
    if (newLength > 1 && robotIndex === -1) {
      props.players.push({
        name: robotName,
        avatar: robotAvatar,
        scores: [],
        totalScore: 0
      });
    } else if (newLength <= 1 && robotIndex !== -1) {
      props.players.splice(robotIndex, 1);
      if (currentPlayerIndex.value >= props.players.length) {
        currentPlayerIndex.value = 0;
      }
    }
  },
  { immediate: true } 
);

// Init scores
props.players.forEach(player => {
  if (!player.scores) player.scores = [];
  if (player.totalScore === undefined) player.totalScore = 0;
});


function stats(player) {
  const flat = player.scores.flat();
  const total = flat.length;
  const miss = flat.filter(x => x === 0).length;
  const hits = flat.filter(x => x !== 0).length;
  const hitsF1 =  player.scores.map(d => d[0]).filter(d => d !== 0).length;
  const hitsF2 =  player.scores.map(d => d[1]).filter(d => d !== 0).length;
  const hitsF3 =  player.scores.map(d => d[2]).filter(d => d !== 0).length;
  const single = flat.filter(x => x === 1).length;
  const double = flat.filter(x => x === 2).length;
  const triple = flat.filter(x => x === 3).length;
  const ttt = player.scores.filter(row => row.filter(x => x === 3).length === 3).length;
  const tt = player.scores.filter(row => row.filter(x => x === 3).length === 2).length;
  const ddd = player.scores.filter(row => row.filter(x => x === 2).length === 3).length;
  const dd = player.scores.filter(row => row.filter(x => x === 2).length === 2).length;
  const shangai = player.scores.filter(row => {
    const set = new Set(row);
    return set.has(1) && set.has(2) && set.has(3);
  }).length;
  return { total, hits, hitsF1, hitsF2, hitsF3, miss, single, double, triple, shangai, ttt, ddd, tt, dd };
}

function setDart(index, value) {
  darts.value[index] = value;
}

const currentTurnScore = computed(() => {
  const target = currentRound.value;
  return darts.value.reduce((sum, multiplier) => sum + multiplier * target, 0);
});


function submitTurn() {
  const player = props.players[currentPlayerIndex.value];

  if (player.name === robotName) {
    // Simulate a robot 
    const LastThrowOf =  props.players.filter(d => d.name !== robotName).map(d => d.scores[d.scores.length - 1])
    const scores = LastThrowOf.map(d => (d[0]  + d[1] + d[2]))
    const indexMax = scores.indexOf(Math.max(...scores));
    const bestThrowOf = LastThrowOf[indexMax] 
    darts.value = [...bestThrowOf];
   }

  player.scores.push([...darts.value]);
  player.totalScore += currentTurnScore.value;
  darts.value = [0, 0, 0];

  if (currentPlayerIndex.value < props.players.length - 1) {
    currentPlayerIndex.value++;
  } else {
    currentPlayerIndex.value = 0;
    currentRound.value++;
  }

  topScore = Math.max(...props.players.filter(d => d.name !== robotName).map(player => player.totalScore))

}

function undoTurn() {
  if (currentRound.value === 1 && currentPlayerIndex.value === 0) return;

  let playerIndex = currentPlayerIndex.value;
  let round = currentRound.value;

  if (playerIndex === 0 && round > 1) {
    playerIndex = props.players.length - 1;
    round -= 1;
  } else {
    playerIndex -= 1;
  }

  currentPlayerIndex.value = playerIndex;
  currentRound.value = round;

  const player = props.players[playerIndex];
  const lastTurn = player.scores.pop();
  if (!lastTurn) return;

  const target = round;
  const lastScore = lastTurn.reduce((sum, multiplier) => sum + multiplier * target, 0);

  player.totalScore -= lastScore;
  darts.value = [0, 0, 0];
}

function replay() {
  window.location.reload();
}

const gameOver = computed(() => currentRound.value > nb);

const sortedPlayers = computed(() =>
  [...props.players].sort((a, b) => b.totalScore - a.totalScore)
);

watch(currentPlayerIndex, async (newIndex) => {
  const player = props.players[newIndex];
  if (player.name === robotName && !gameOver.value){
    await nextTick();
    submitTurn();
  }
});

const humanPlayersSorted = computed(() => 
  props.players
    .filter(p => p.name !== robotName)
    .sort((a, b) => b.totalScore - a.totalScore)
);
</script>


<template>

<div>

   <div class="container">
      <div v-if="!gameOver">
        <h2 class="round-circle">{{ currentRound }}</h2>



<div class="avatar-lineup">
  <div
    v-for="(player, index) in props.players"
    :key="player.name"
    class="avatar-wrapper"
  >
    <img
      :src="player.avatar"
      :alt="player.name"
      class="avatar"
      :class="{ current: index === currentPlayerIndex }"
    />
    <div
      :class="[
        'score-badge',
        { 
          'bestscore-badge': player.totalScore === topScore 
                          && player.name !== robotName 
                          && topScore !== 0
        }
      ]"
    >
      {{ player.totalScore }}
    </div>
  </div>
</div>
<hr/>


        <h3>{{ props.players[currentPlayerIndex].name }}</h3>
        <!-- <p style="font-weight: normal; color: gray; margin-top: 4px;">
          Score avant de jouer : {{ props.players[currentPlayerIndex].totalScore }}
        </p> -->


        <div
          v-for="(dart, index) in darts"
          :key="index"
          class="dart-controls"
          style="display: flex; align-items: center; gap: 6px;"
        >
          <div v-if="props.players[currentPlayerIndex].name !== robotName" class="buttons">
            <button @click="setDart(index, 0)" :class="{ active: dart === 0 }">Miss</button>
            <button @click="setDart(index, 1)" :class="{ active: dart === 1 }">Single</button>
            <button @click="setDart(index, 2)" :class="{ active: dart === 2 }">Double</button>
            <button @click="setDart(index, 3)" :class="{ active: dart === 3 }">Triple</button>
          </div>
        </div>

        <p style="font-weight: normal; color: gray; margin-top: 4px;">+{{ currentTurnScore }}</p>
        <p style="margin-top: 12px; font-weight: bold;">
          Score : {{ currentTurnScore + props.players[currentPlayerIndex].totalScore }}
        </p>

        <p v-if="props.players[currentPlayerIndex].name !== robotName">
          <button @click="submitTurn" class="validate">Valider ce tour</button>
        </p>
        <p><button @click="undoTurn" class="undo-button">&#8592;</button></p>
      </div>

      <div v-else>
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
    </template>
    {{ player.name }}
  </div>
  <img :src="player.avatar" alt="avatar" class="final-avatar-large" />

 
  <div class="final-player-info">
    <div class="final-player-stats">
      <span class="stat-badge">Hits : {{ stats(player).hits }}/{{ stats(player).total }}</span>
      <span class="stat-badge">Hits (F1) : {{ stats(player).hitsF1 }}/{{ stats(player).total/3 }}</span>
      <span class="stat-badge">Hits (F2) : {{ stats(player).hitsF2 }}/{{ stats(player).total/3 }}</span>
      <span class="stat-badge">Hits (F3) : {{ stats(player).hitsF3 }}/{{ stats(player).total/3 }}</span>
      <span class="stat-badge">Miss : {{ stats(player).miss }}</span>
      <span class="stat-badge">Single : {{ stats(player).single }}</span>
      <span class="stat-badge">Double : {{ stats(player).double }}</span>
      <span class="stat-badge">Triple : {{ stats(player).triple }}</span>
      <span v-if="stats(player).shangai >= 1" class="stat-badge awsome-badge">Shangai : {{ stats(player).shangai }}</span>
      <span v-if="stats(player).ttt >= 1" class="stat-badge awsome-badge">ttt : {{ stats(player).ttt }}</span>
      <span v-if="stats(player).ddd >= 1" class="stat-badge awsome-badge">ddd : {{ stats(player).ddd }}</span>
      <span v-if="stats(player).tt >= 1" class="stat-badge awsome-badge">tt : {{ stats(player).tt }}</span>
      <span v-if="stats(player).dd >= 1" class="stat-badge awsome-badge">dd : {{ stats(player).dd }}</span>
    </div>
  </div>
  <span class="final-player-score">{{ player.totalScore }} pts</span>
</li>
      </ul>
        <p><button @click="replay">Rejouer</button></p>
        <p><button @click="replay">Sauvegarder la partie (todo)</button></p>
      </div>
    </div>
  </div>

</template>



<style scoped>

html, body {
  overscroll-behavior-y: contain;
  overflow: hidden;
  height:100%;
  margin:0;
  padding:0;
}


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.avatar-lineup {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 400px;
  padding: 8px 0;
  justify-content: center;
}

.avatar-lineup img.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  filter: grayscale(30%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.avatar-lineup img.avatar.current {
  filter: none;
  opacity: 1;
  border: 3px solid rgba(233, 30, 99);
  transform: scale(1.2);
  z-index: 1;
}

.round-circle {
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: 50%;
  background-color: rgba(233, 30, 99);
  color: "white";
  text-align: center;
  font-size: 2.4rem;
  font-weight: bold;
  margin: 10px auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}



.dart-controls {
  margin: 0.5rem 0;
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: 6px;
}



.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 480px) {
  .buttons button {
    padding: 6px 10px;
    font-size: 1.2rem;
    min-width: 0px;
  }

  .buttons {
    gap: 6px;
  }
}


button.active {
  background-color: var(--primary, #007BFF);
  color: white;
  font-weight: bold;
}

.validate {
  margin-top: 1rem;
}

.undo-button {
  margin-top: 1rem;
  margin-left: 12px;
  background-color: #ccc;
  color: #333;
  font-weight: normal;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.undo-button:hover {
  background-color: #bbb;
}

.score-recap {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-bottom: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}



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
  /* ajoute un léger margin entre nom et avatar si besoin */
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

.awsome-badge {
  border-color: #e91e63;
  background-color: #e91e63;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 6px rgba(233, 30, 99, 0.4);
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 12px; 
}

.avatar {
  width: 60px;     
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.score-badge {
  position: absolute;
  bottom: -10px; 
  right: -10px;    
  background-color: #2196f3;
  color: white;
  padding: 4px 9px;
  border-radius: 14px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  user-select: none;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
}

.bestscore-badge {
  background-color: #e91e63;
  font-weight: bold;
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
  margin: 0 auto;       /* centre horizontalement la liste */
  max-width: 600px;     /* limite la largeur pour un meilleur centrage */
  display: flex;
  flex-direction: column;
  align-items: center;  /* centre les éléments enfants horizontalement */
  gap: 24px;            /* espace entre les joueurs */
}


</style>