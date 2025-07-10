<template>
    <div class="scores-page">
  
      <div v-if="bestScores.length" class="players-list">
        <div v-for="(score, index) in bestScores" :key="index" class="player-card">
          <h3 class="player-name">
            <span class="medal" :class="'medal-' + index">
              <span v-if="index === 0">🥇</span>
              <span v-else-if="index === 1">🥈</span>
              <span v-else-if="index === 2">🥉</span>
              <span v-else-if="index === 3">🍫</span>
            </span>
            {{ score.name }}
          </h3>
          <p class="score-text">
            Meilleur score : <b>{{ score.score }} pts</b>
            <small> ({{ formatDate(score.timestamp) }})</small>
          </p>
          <p class="score-text">
            Score moyen : <b>{{ score.average }} pts</b>
          </p>
          <p class="score-text">
            Parties jouées : <b>{{ score.gamesPlayed }}</b>
          </p>
        </div>
      </div>
  
      <div v-if="numberOne" class="player-card highlight">
        <h3 class="player-name highlight-name">
          {{ numberOne.name }}
        </h3>
        <p class="score-text">
          Meilleur score : <b>{{ numberOne.score }} pts</b>
          <small> ({{ formatDate(numberOne.timestamp) }})</small>
        </p>
        <p class="score-text">
          Score moyen : <b>{{ numberOne.average }} pts</b>
        </p>
        <p class="score-text">
          Parties jouées : <b>{{ numberOne.gamesPlayed }}</b>
        </p>
      </div>
  
      <p v-if="!numberOne">Aucun score enregistré.</p>
  
      <button @click="$emit('back')" class="back-button">Retour</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../supabase';
  import { min, max, mean, sum } from 'd3-array';
  const d3 = Object.assign({}, { min, max, mean, sum });
  
  const bestScores = ref([]);
  const numberOne = ref(null);
  
  async function fetchScores() {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false });
  
    if (error) {
      console.error('Erreur de récupération des scores :', error);
      return;
    }
    if (!data.length) return;

const stats = getstats(data);
  console.log(stats)
   
  }
  
//   function formatDate(timestamp) {
//     return new Date(timestamp).toLocaleString('fr-FR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   }

function getTimestamps() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = janvier

  // 1er septembre dernier
  const septFirst =
    currentMonth >= 8
      ? new Date(currentYear, 8, 1)
      : new Date(currentYear - 1, 8, 1);
  const timestampSeptFirst = septFirst.getTime();

  // 31 juillet prochain
  const july31 =
    currentMonth <= 6
      ? new Date(currentYear, 6, 31)
      : new Date(currentYear + 1, 6, 31);
  const timestampJuly31 = july31.getTime();

  return {
    septFirstLastYear: timestampSeptFirst,
    july31Next: timestampJuly31
  };
}

function streak(arr) {
  arr = arr.flat();
  let maxLength = 0;
  let currentLength = 0;
  let startIndexMax = -1;
  let startIndexCurrent = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== 0) {
      if (currentLength === 0) {
        startIndexCurrent = i;
      }
      currentLength++;
      if (currentLength > maxLength) {
        maxLength = currentLength;
        startIndexMax = startIndexCurrent;
      }
    } else {
      currentLength = 0;
    }
  }

  return maxLength;
}

function shangai(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0]; // index 0 à 3
    turn.forEach((d) => counts[d]++);
    return counts[1] === 1 && counts[2] === 1 && counts[3] === 1;
  }).length;
}

function getstats(scores, last = 10) {





  // Players
  let players = [...new Set(scores.map((d) => d.name))].map((name) => ({
    name
  }));

  // Scores if the year (Between September 1 and July 31)
  const intervall = getTimestamps();
  const scores_year = scores
    .filter((d) => d.timestamp >= intervall.septFirstLastYear)
    .filter((d) => d.timestamp <= intervall.july31Next);
  // Total number of games
  const nb_all = scores.filter((d) => d.name == "Number One").length;
  const nb_year = scores_year.filter((d) => d.name == "Number One").length;

  // Stats
  players = players.map((d) => {
    const data = scores.filter((e) => e.name == d.name);
    const data_year = scores_year.filter((e) => e.name == d.name);
    const data_last = data.slice(-last);

    // Played
    const played_all = data.length;
    const played_year = data_year.length;
    const played_last = data_last.length;
    // Assiduity
    const assiduity_all = Math.round((1000 * data.length) / nb_all) / 10;
    const assiduity_year = Math.round((1000 * data_year.length) / nb_year) / 10;
    // Mean
    const mean_all_raw = d3.mean(data.map((d) => d.score));
    const mean_all = Math.round(mean_all_raw);
    const mean_year_raw = d3.mean(data_year.map((d) => d.score));
    const mean_year = Math.round(mean_year_raw);
    const mean_last_raw = d3.mean(data_last.map((d) => d.score));
    const mean_last = Math.round(mean_last_raw);
    // Best
    const max_all = Math.round(d3.max(data.map((d) => d.score)));
    const max_year = Math.round(d3.max(data_year.map((d) => d.score)));
    const max_last = Math.round(d3.max(data_last.map((d) => d.score)));
    // Worst
    const min_all = Math.round(d3.min(data.map((d) => d.score)));
    const min_year = Math.round(d3.min(data_year.map((d) => d.score)));
    const min_last = Math.round(d3.min(data_last.map((d) => d.score)));
    // Streak

    
    const streak_all = d3.max(
      data.map((d) => JSON.parse(d.hits).flat()).map((d) => streak(d))
    );
    const streak_year = d3.max(
      data_year.map((d) => JSON.parse(d.hits).flat()).map((d) => streak(d))
    );
    const streak_last = d3.max(
      data_last.map((d) => JSON.parse(d.hits).flat()).map((d) => streak(d))
    );

    // Shangai
    const shangai_all = d3.sum(data.map((d) => shangai(JSON.parse(d.hits))));
    const shangai_pct_all =
      Math.round(10 * (shangai_all / data.length) * 100) / 10;
    const shangai_year = d3.sum(data_year.map((d) => shangai(JSON.parse(d.hits))));
    const shangai_pct_year =
      Math.round(10 * (shangai_year / data.length) * 100) / 10;
    const shangai_last = d3.sum(data_last.map((d) => shangai(JSON.parse(d.hits))));
    const shangai_pct_last =
      Math.round(10 * (shangai_last / data.length) * 100) / 10;

    // ttt
    // ddd
    // tt
    // dd
    // win

    return {
      ...d,
      // all
      played_all,
      mean_all_raw,
      mean_all,
      max_all,
      min_all,
     streak_all,
    assiduity_all,
      shangai_all,
      shangai_pct_all,
      // year
      played_year,
      mean_year_raw,
      mean_year,
      max_year,
      min_year,
     streak_year,
    assiduity_year,
      shangai_year,
      shangai_pct_year,
      // Last
      played_last,
      mean_last_raw,
      mean_last,
      max_last,
      min_last,
    streak_last,
      shangai_last,
      shangai_pct_last
    };
  });

  // Rank
  players = [...players]
    .sort((a, b) => b["mean_all_raw"] - a["mean_all_raw"])
    .map((d, i) => ({ ...d, rank_all: i }));
  players = [...players]
    .sort((a, b) => b["mean_year_raw"] - a["mean_year_raw"])
    .map((d, i) => ({ ...d, rank_year: i }));
  players = [...players]
    .sort((a, b) => b["mean_last_raw"] - a["mean_last_raw"])
    .map((d, i) => ({ ...d, rank_last: i }));

  // Output
  return players;
}





  
  onMounted(() => {
    fetchScores();
  });
  </script>
  
  <style scoped>
  .scores-page {
    max-width: 900px;
    margin: 1.5rem auto;
    padding: 1rem 1.5rem;
    color: #13171F;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    text-align: left;
    min-height: 100vh;
    box-sizing: border-box;
  }
  
  h2 {
    font-weight: 700;
    font-size: 1.6rem;
    margin-bottom: 2rem;
    color: #13171F;
    text-align: center;
  }
  
  .players-list {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    align-items: center;
  }
  
  .player-card {
    background-color: #f8f9fa;
    box-shadow: 0 6px 12px rgb(0 0 0 / 0.1);
    border-radius: 14px;
    padding: 16px 20px;
    width: 100%;
    max-width: 480px;
    transition: box-shadow 0.3s ease;
    color: #13171F;
    text-align: left;
  }
  
  .player-card:hover {
    box-shadow: 0 10px 20px rgb(0 0 0 / 0.15);
  }
  
  .player-card.highlight {
    border: 2px solid #0288d1;
    max-width: 500px;
    margin: 2rem auto;
    background-color: #e3f2fd;
    box-shadow: 0 12px 24px rgb(2 136 209 / 0.25);
    color: #13171F;
    text-align: left;
  }
  
  .player-name {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #13171F;
  }
  
  .highlight-name {
    font-size: 1.4rem;
  }
  
  .medal {
    font-size: 1.4rem;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .medal-0 {
    color: #ffc107;
  }
  
  .medal-1 {
    color: #90a4ae;
  }
  
  .medal-2 {
    color: #ff7043;
  }
  
  .medal-3 {
    color: #6d4c41;
  }
  
  .score-text {
    font-size: 0.85rem;
    margin: 0.18rem 0;
    color: #13171F;
  }
  
  .score-text small {
    font-size: 0.75rem;
    color: #555;
  }
  
  .back-button {
  display: block;
  margin: 2rem auto 0 auto;
  padding: 0.55rem 1.4rem;
  background-color: #0288d1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}
  
  .back-button:hover {
    background-color: #0277bd;
  }
  
  @media (max-width: 520px) {
    .scores-page {
      padding: 1rem 1rem;
    }
  
    .player-card {
      max-width: 100%;
      padding: 14px 12px;
    }
  
    .player-name {
      font-size: 1.1rem;
    }
  
    .score-text {
      font-size: 0.8rem;
    }
  
    .highlight-name {
      font-size: 1.2rem;
    }
  }
  </style>
  