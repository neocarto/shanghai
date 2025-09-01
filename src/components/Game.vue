<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import GameStats from './GameStats.vue';
import {streak, streakLoose} from '../helpers/computeStats';
import confetti from 'canvas-confetti'; // 🎉 Confettis

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
  players: Array,
  role: String
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
        id:0,
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
  if (!player.curses) player.curses = 0;
  if (player.totalScore === undefined) player.totalScore = 0;
});


function stats(player) {
// Record
  // Display

  const flat = player.scores.flat();
  const strk = streak(flat)
  const strkloose = streakLoose(flat)
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
  return { total, hits, hitsF1, hitsF2, hitsF3, miss, single, double, triple, shangai, ttt, ddd, tt, dd , strk, strkloose };
}

function setDart(index, value) {
  darts.value[index] = value;
  if (navigator.vibrate) {
    navigator.vibrate(30);
      }
    }

const currentTurnScore = computed(() => {
  const target = currentRound.value;
  return darts.value.reduce((sum, multiplier) => sum + multiplier * target, 0);
});


function submitTurn() {
  if (navigator.vibrate) {
    navigator.vibrate(30);
      }
  const player = props.players[currentPlayerIndex.value];

  if (player.name === robotName) {
    // Simulate a robot 
    const LastThrowOf =  props.players.filter(d => d.name !== robotName).map(d => d.scores[d.scores.length - 1])
    const scores = LastThrowOf.map(d => (d[0]  + d[1] + d[2]))
    const indexMax = scores.indexOf(Math.max(...scores));
    const bestThrowOf = LastThrowOf[indexMax] 
    darts.value = [...bestThrowOf];
   }

  const row = [...darts.value];
  player.scores.push(row);
  player.totalScore += currentTurnScore.value;

  const isShangai = new Set(row).has(1) && new Set(row).has(2) && new Set(row).has(3);
  // 🎉 Confettis pour Shangai (joueur humain uniquement)
  if (isShangai && player.name !== robotName) {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }


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

  // Trouver le joueur humain précédent (non robot)
  function getPreviousHumanPlayerIndex(index) {
    const totalPlayers = props.players.length;
    for (let i = 1; i <= totalPlayers; i++) {
      const newIndex = (index - i + totalPlayers) % totalPlayers;
      if (props.players[newIndex].name !== robotName) {
        return newIndex;
      }
    }
    return index;
  }

  // Trouver l'index du robot (s'il existe)
  const robotIndex = props.players.findIndex(p => p.name === robotName);

  // Flag pour savoir si on recule au tour précédent
  let backToPreviousRound = false;

  if (playerIndex === 0) {
    if (round === 1) return; // début de la partie, pas de retour possible

    round -= 1;
    playerIndex = getPreviousHumanPlayerIndex(props.players.length);
    backToPreviousRound = true;  // on revient au tour précédent
  } else {
    playerIndex = getPreviousHumanPlayerIndex(playerIndex);
  }

  currentPlayerIndex.value = playerIndex;
  currentRound.value = round;

  // Annuler le dernier score du joueur humain
  const player = props.players[playerIndex];
  const lastTurn = player.scores.pop();
  if (lastTurn) {
    const target = round;
    const lastScore = lastTurn.reduce((sum, multiplier) => sum + multiplier * target, 0);
    player.totalScore -= lastScore;
  }

  // Si on est revenu au tour précédent, annuler aussi le dernier score du robot (s'il existe)
  if (backToPreviousRound && robotIndex !== -1) {
    const robotPlayer = props.players[robotIndex];
    if (robotPlayer.scores.length > 0) {
      const lastRobotTurn = robotPlayer.scores[robotPlayer.scores.length - 1];
      const robotLastScoreValue = lastRobotTurn.reduce((sum, multiplier) => sum + multiplier * round, 0);
      robotPlayer.totalScore -= robotLastScoreValue;
      robotPlayer.scores.pop();
    }
  }

  // Réinitialiser les flèches
  darts.value = [0, 0, 0];
}


function countCurses() {
  const player = props.players[currentPlayerIndex.value];
  if(player.name !== robotName) {
    player.curses += 1
    console.log("Gros Mot ! ", player.name, " ", player.curses)
  }
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
  <p v-if="role === 'admin'" style="font-size: 0.8rem; color: gray; text-align: center;  margin-bottom: -10px;">
    Partie officielle et enregistrée
  </p>
   <div class="container">
      <div v-if="!gameOver">
        <h2 class="round-circle">{{ currentRound }}</h2>


        <h1>{{ props.players[currentPlayerIndex].name }}</h1>
        <hr/>
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
                         && topScore !== 0,
      'score-robot': player.name === robotName
    }
  ]"
>
  {{ player.totalScore }}
</div>
  </div>
</div>
<hr/>



        <div
          v-for="(dart, index) in darts"
          :key="index"
          class="dart-controls"
          style="display: flex; align-items: center; gap: 6px;"
        >
          <div v-if="props.players[currentPlayerIndex].name !== robotName" class="buttons">
            <button class="dart-button" @click="setDart(index, 0)" :class="{ active: dart === 0 }">Miss</button>
            <button class="dart-button" @click="setDart(index, 1)" :class="{ active: dart === 1 }">Single</button>
            <button class="dart-button" @click="setDart(index, 2)" :class="{ active: dart === 2 }">Double</button>
            <button class="dart-button" @click="setDart(index, 3)" :class="{ active: dart === 3 }">Triple</button>
          </div>
        </div>


        <p id="emitScoreContainer" v-if="props.players[currentPlayerIndex].name !== robotName">
          <button @click="countCurses" class="curseCounter">🤬 ! {{ props.players[currentPlayerIndex].curses }}</button>
          <button @click="submitTurn" class="validate">Valider ce tour (+{{currentTurnScore}} pts)</button>
        </p>
        <p><button @click="undoTurn" class="undo-button">&#8592;</button></p>
      </div>

      <div v-else>
        <GameStats 
    :sortedPlayers="sortedPlayers" 
    :humanPlayersSorted="humanPlayersSorted"
    :robotName="robotName" 
    :stats="stats"
    :replay="replay"
    :role="props.role"
     @view-scores="$emit('view-scores')"
  />
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
  width: 70px;
  height: 70px;
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
  color: white;
  text-align: center;
  font-size: 2.9rem;
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

.dart-button {
  height: 70px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

#emitScoreContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

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

.score-robot {
  position: absolute;
  bottom: -10px; 
  right: -10px;    
  background-color: #CCC;
  color: #2196f3;
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






</style>
