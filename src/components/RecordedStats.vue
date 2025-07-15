<template>





    <div class="scores-page">
      <div class="podium" v-if="stats.length >= 3" style="position: relative; display: inline-block;">
  <img src="/img/podium.webp" alt="Podium" class="podium-image" />

  <!-- Texte sur la marche 1 -->
  <div class="podium-text text-1">{{ stats[0].name }}<span style="font-size: 0.5rem;"> ({{ stats[0].mean_last }})</span></div>

  <!-- Texte sur la marche 2 -->
  <div class="podium-text text-2">{{ stats[1].name }}<span style="font-size: 0.5rem;"> ({{ stats[1].mean_last }})</span></div>

  <!-- Texte sur la marche 3 -->
  <div class="podium-text text-3">{{ stats[2].name }}<span style="font-size: 0.5rem;"> ({{ stats[2].mean_last }})</span></div>
  <div class="podium-text text-4">Chocolat : {{ stats[3].name }} ({{ stats[3].mean_last }})</div>
</div>

  
      <div v-if="stats.length" class="players-list">
        <div v-for="(score, index) in stats" :key="index" class="player-card">
          <h2 class="player-name">
            {{ score.medal_mean_last }}
            {{ score.name }} - <small>{{ score.mean_last}} pts</small>
          </h2>

          <table class="score-table">
    <thead>
      <tr>
        <th></th>
        <th>Sur 10 parties</th>
        <th>Sur l'année</th>
        <th>Hall of Fame</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Parties</th>
        <td>{{ score.played_last }}</td>
        <td>{{ score.played_year }}</td>
        <td>{{ score.played_all }}</td>
      </tr>
      <tr>
        <th>Assiduité</th>
        <td>-</td>
        <td>{{ score.assiduity_year }} %</td>
        <td>{{ score.assiduity_all }} %</td>
      </tr>
      <tr>
        <th>Moyenne</th>
        <td>{{ score.mean_last }} {{ score.medal_mean_last }} </td>
        <td>{{ score.mean_year }} {{ score.medal_mean_year }} </td>
        <td>{{ score.mean_all }} {{ score.medal_mean_all }} </td>
      </tr>
      <tr>
        <th>Cumul</th>
        <td>{{ Math.round(score.cumul_last/100)/10 + "K" }} {{ score.medal_cumul_last }} </td>
        <td>{{ Math.round(score.cumul_year/100)/10 + "K"  }} {{ score.medal_cumul_year }} </td>
        <td>{{ Math.round(score.cumul_all/100)/10 + "K"  }} {{ score.medal_cumul_all }} </td>
      </tr>
      <tr>
        <th>Meilleur</th>
        <td>{{ score.max_last }} {{ score.medal_max_last }} </td>
        <td>{{ score.max_year }} {{ score.medal_max_year }} </td>
        <td>{{ score.max_all }} {{ score.medal_max_all }} </td>
      </tr>

      <tr>
        <th>Streak</th>
        <td>{{ score.streak_last }} {{ score.medal_streak_last }} </td>
        <td>{{ score.streak_year }} {{ score.medal_streak_year }} </td>
        <td>{{ score.streak_all }} {{ score.medal_streak_all }} </td>
      </tr>
      <tr>
        <th>Hits <small>(60)</small></th>
        <td>{{ score.hits_last }} {{ score.medal_hits_last }} </td>
        <td>{{ score.hits_year }} {{ score.medal_hits_year }}  </td>
        <td>{{ score.hits_all }} {{ score.medal_hits_all }} </td>
      </tr>
      <tr>
        <th>Hits <small>(180)</small></th>
        <td>{{ score.hits2_last }} {{ score.medal_hits2_last }}</td>
        <td>{{ score.hits2_year }}  {{ score.medal_hits2_year }}</td>
        <td>{{ score.hits2_all }} {{ score.medal_hits2_all }}</td>
      </tr>
      <tr>
        <th>Meilleur coup</th>
        <td>{{ score.hitbest_last }} {{ score.medal_hitbest_last }}</td>
        <td>{{ score.hitbest_year }} {{ score.medal_hitbest_last }} </td>
        <td>{{ score.hitbest_all }} {{ score.medal_hitbest_last }}</td>
      </tr>
      <tr>
        <th>Triples</th>
        <td>{{ score.triple_last }} %  {{ score.medal_triple_last }}</td>
        <td>{{ score.triple_year }} % {{ score.medal_triple_year }}</td>
        <td>{{ score.triple_all }} % {{ score.medal_triple_all }}</td>
      </tr>
      <tr>
        <th>Doubles</th>
        <td>{{ score.double_last }} % {{ score.medal_double_last }}</td>
        <td>{{ score.double_year }} % {{ score.medal_double_year }}</td>
        <td>{{ score.double_all }} % {{ score.medal_double_all }}</td>
      </tr>
      <tr>
        <th>Shanghai</th>
        <td>{{ score.shanghai_last }}</td>
        <td>{{ score.shanghai_year }}</td>
        <td>{{ score.shanghai_all }}</td>
      </tr>
      <tr>
        <th>ttt</th>
        <td>{{ score.ttt_last }}</td>
        <td>{{ score.ttt_year }}</td>
        <td>{{ score.ttt_all }}</td>
      </tr>
      <tr>
        <th>tt</th>
        <td>{{ score.tt_last }}</td>
        <td>{{ score.tt_year }}</td>
        <td>{{ score.tt_all }}</td>
      </tr>
      <tr>
        <th>ddd</th>
        <td>{{ score.ddd_last }}</td>
        <td>{{ score.ddd_year }}</td>
        <td>{{ score.ddd_all }}</td>
      </tr>
      <tr>
        <th>dd</th>
        <td>{{ score.dd_last }}</td>
        <td>{{ score.dd_year }}</td>
        <td>{{ score.dd_all }}</td>
      </tr>
    </tbody>
  </table>
         </div>

         <div  class="player-card">
          <h2 class="player-name"> {{ numberOne.name }}</h2>
        
    <table class="score-table">
    <thead>
      <tr>
        <th></th>
        <th>Sur 10 parties</th>
        <th>Sur l'année</th>
        <th>Hall of Fame</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Parties</th>
        <td>{{ numberOne.played_last }}</td>
        <td>{{ numberOne.played_year }}</td>
        <td>{{ numberOne.played_last }}</td>
      </tr>
      <tr>
        <th>Moyenne</th>
        <td>{{ numberOne.mean_last }}</td>
        <td>{{ numberOne.mean_year }}</td>
        <td>{{ numberOne.mean_all }}</td>
      </tr>
      <tr>
        <th>Meilleur</th>
        <td>{{ numberOne.max_last }}</td>
        <td>{{ numberOne.max_year }}</td>
        <td>{{ numberOne.max_all }}</td>
      </tr>
      </tbody> 
 </table> 
        
        
        </div>

</div>






      <button @click="$emit('back')" class="back-button">Retour</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../supabase';
  import { min, max, mean, sum, ascending } from 'd3-array';
  const d3 = Object.assign({}, { min, max, mean, sum, ascending });
  
  const stats = ref([]);
  const numberOne = ref([]);
  
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

const result = getstats(data);

const remove = ["Number One", "Felix"];
stats.value = result.filter(d => !remove.includes(d.name));
numberOne.value = result.find(d => d.name === "Number One");

  
  }
  

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

function medal(rank) {
  switch (rank) {
    case 1:
      return "🥇";
      break;
    case 2:
      return "🥈";
      break;
    case 3:
      return "🥉";
      break;
    case 4:
      return "🍫";
      break;
    default:
      return "";
  }
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
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[1] === 1 && counts[2] === 1 && counts[3] === 1;
  }).length;
}

function tt(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0]; 
    turn.forEach((d) => counts[d]++);
    return counts[3] === 2;
  }).length;
}

function ttt(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0]; 
    turn.forEach((d) => counts[d]++);
    return counts[3] === 3;
  }).length;
}

function dd(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0]; 
    turn.forEach((d) => counts[d]++);
    return counts[2] === 2;
  }).length;
}

function ddd(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0]; 
    turn.forEach((d) => counts[d]++);
    return counts[2] === 3;
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
    const data_last =   data.slice().sort((a, b) => d3.ascending(a.timestamp, b.timestamp)).slice(-last);

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

     // Cumul
    const cumul_all = Math.round(d3.sum(data.map((d) => d.score)))
    const cumul_year = Math.round(d3.sum(data_year.map((d) => d.score)));
    const cumul_last = Math.round(d3.sum(data_last.map((d) => d.score)));
    // Worst
    const min_all = Math.round(d3.min(data.map((d) => d.score)));
    const min_year = Math.round(d3.min(data_year.map((d) => d.score)));
    const min_last = Math.round(d3.min(data_last.map((d) => d.score)));
    // Hits
    const hits_all = d3.max(data.map((d) => JSON.parse(d.hits)).map((d) => d.flat().filter((d) => d != 0).length))
    const hits_year = d3.max(data_year.map((d) => JSON.parse(d.hits)).map((d) => d.flat().filter((d) => d != 0).length))
    const hits_last = d3.max(data_last.map((d) => JSON.parse(d.hits)).map((d) => d.flat().filter((d) => d != 0).length))
    // Hits2
    const hits2_all = d3.max(data.map((d) => JSON.parse(d.hits)).map((d) =>d3.sum(d.flat().filter((d) => d != 0))))
    const hits2_year = d3.max(data_year.map((d) => JSON.parse(d.hits)).map((d) =>d3.sum(d.flat().filter((d) => d != 0))))
    const hits2_last = d3.max(data_last.map((d) => JSON.parse(d.hits)).map((d) =>d3.sum(d.flat().filter((d) => d != 0))))
    // Best Hits
    const hitbest_all = d3.max(data.map((d,i) => d3.max(JSON.parse(d.hits).map((d,i) => d3.sum(d) * (i+1)))))
    const hitbest_year = d3.max(data_year.map((d,i) => d3.max(JSON.parse(d.hits).map((d,i) => d3.sum(d) * (i+1)))))
    const hitbest_last = d3.max(data_last.map((d,i) => d3.max(JSON.parse(d.hits).map((d,i) => d3.sum(d) * (i+1)))))
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

  // triple
    const triple_all = Math.round(data.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 3).length/played_all * 10)/10
    const triple_year = Math.round(data_year.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 3).length/played_year * 10)/10
    const triple_last = Math.round(data_last.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 3).length/played_last * 10)/10
   
  // double
    const double_all = Math.round(data.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 2).length/played_all * 10)/10
    const double_year = Math.round(data_year.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 2).length/played_year * 10)/10
    const double_last = Math.round(data_last.map(d => (JSON.parse(d.hits))).flat(2).filter((d) => d == 2).length/played_last * 10)/10

    // Shangai
    const shanghai_all = d3.sum(data.map((d) => shangai(JSON.parse(d.hits))));
    const shanghai_year = d3.sum(data_year.map((d) => shangai(JSON.parse(d.hits))));
    const shanghai_last = d3.sum(data_last.map((d) => shangai(JSON.parse(d.hits))));

    // tt, ttt, dd, ddd
    const tt_all = d3.sum(data.map((d) => tt(JSON.parse(d.hits))));
    const tt_year = d3.sum(data_year.map((d) => tt(JSON.parse(d.hits))));
    const tt_last = d3.sum(data_last.map((d) => tt(JSON.parse(d.hits))));
    const ttt_all = d3.sum(data.map((d) => ttt(JSON.parse(d.hits))));
    const ttt_year = d3.sum(data_year.map((d) => ttt(JSON.parse(d.hits))));
    const ttt_last = d3.sum(data_last.map((d) => ttt(JSON.parse(d.hits))));

    const dd_all = d3.sum(data.map((d) => dd(JSON.parse(d.hits))));
    const dd_year = d3.sum(data_year.map((d) => dd(JSON.parse(d.hits))));
    const dd_last = d3.sum(data_last.map((d) => dd(JSON.parse(d.hits))));
    const ddd_all = d3.sum(data.map((d) => ddd(JSON.parse(d.hits))));
    const ddd_year = d3.sum(data_year.map((d) => ddd(JSON.parse(d.hits))));
    const ddd_last = d3.sum(data_last.map((d) => ddd(JSON.parse(d.hits))));


    return {
      ...d,
      played_all,
      mean_all_raw,
      mean_all,
      max_all,
      min_all,
     streak_all,
    assiduity_all,
      shanghai_all,
      played_year,
      mean_year_raw,
      mean_year,
      max_year,
      min_year,
     streak_year,
    assiduity_year,
      shanghai_year,
      played_last,
      mean_last_raw,
      mean_last,
      max_last,
      min_last,
    streak_last,
      shanghai_last,
      hits_all,
      hits_year,
      hits_last,
      hits2_all,
      hits2_year,
      hits2_last,
      hitbest_all,
      hitbest_year,
      hitbest_last,
      tt_all,
      tt_year,
      tt_last,
      ttt_all,
      ttt_year,
      ttt_last,
      dd_all,
      dd_year,
      dd_last,
      ddd_all,
      ddd_year,
      ddd_last,
      cumul_all,
      cumul_year,
      cumul_last,
      triple_all,
      triple_year,
      triple_last,
      double_all,
      double_year,
      double_last,   
    };
  });

  // Rank & medals
  players = [...players]
    .sort((a, b) => b["max_all"] - a["max_all"])
    .map((d, i) => ({ ...d, medal_max_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["max_year"] - a["max_year"])
    .map((d, i) => ({ ...d, medal_max_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["max_last"] - a["max_last"])
    .map((d, i) => ({ ...d, medal_max_last: medal(i) }));

    players = [...players]
    .sort((a, b) => b["cumul_all"] - a["cumul_all"])
    .map((d, i) => ({ ...d, medal_cumul_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["cumul_year"] - a["cumul_year"])
    .map((d, i) => ({ ...d, medal_cumul_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["cumul_last"] - a["cumul_last"])
    .map((d, i) => ({ ...d, medal_cumul_last: medal(i) }));



    players = [...players]
    .sort((a, b) => b["streak_all"] - a["streak_all"])
    .map((d, i) => ({ ...d, medal_streak_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["streak_year"] - a["streak_year"])
    .map((d, i) => ({ ...d, medal_streak_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["streak_last"] - a["streak_last"])
    .map((d, i) => ({ ...d, medal_streak_last: medal(i) }));

    players = [...players]
    .sort((a, b) => b["hits_all"] - a["hits_all"])
    .map((d, i) => ({ ...d, medal_hits_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["hits_year"] - a["hits_year"])
    .map((d, i) => ({ ...d, medal_hits_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["hits_last"] - a["hits_last"])
    .map((d, i) => ({ ...d, medal_hits_last: medal(i) }));



    players = [...players]
    .sort((a, b) => b["hitbest_all"] - a["hitbest_all"])
    .map((d, i) => ({ ...d, medal_hitbest_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["hitbest_year"] - a["hitbest_year"])
    .map((d, i) => ({ ...d, medal_hitbest_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["hitbest_last"] - a["hitbest_last"])
    .map((d, i) => ({ ...d, medal_hitbest_last: medal(i) }));



    players = [...players]
    .sort((a, b) => b["hits2_all"] - a["hits2_all"])
    .map((d, i) => ({ ...d, medal_hits2_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["hits2_year"] - a["hits2_year"])
    .map((d, i) => ({ ...d, medal_hits2_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["hits2_last"] - a["hits2_last"])
    .map((d, i) => ({ ...d, medal_hits2_last: medal(i) }));


    players = [...players]
    .sort((a, b) => b["triple_all"] - a["triple_all"])
    .map((d, i) => ({ ...d, medal_triple_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["triple_year"] - a["triple_year"])
    .map((d, i) => ({ ...d, medal_triple_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["triple_last"] - a["triple_last"])
    .map((d, i) => ({ ...d, medal_triple_last: medal(i) }));


    players = [...players]
    .sort((a, b) => b["double_all"] - a["double_all"])
    .map((d, i) => ({ ...d, medal_double_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["double_year"] - a["double_year"])
    .map((d, i) => ({ ...d, medal_double_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["double_last"] - a["double_last"])
    .map((d, i) => ({ ...d, medal_double_last: medal(i) }));
 
  
    players = [...players]
    .sort((a, b) => b["mean_all_raw"] - a["mean_all_raw"])
    .map((d, i) => ({ ...d, medal_mean_all: medal(i) }));
  players = [...players]
    .sort((a, b) => b["mean_year_raw"] - a["mean_year_raw"])
    .map((d, i) => ({ ...d, medal_mean_year: medal(i) }));
  // Final sorting
    players = [...players]
    .sort((a, b) => b["mean_last_raw"] - a["mean_last_raw"])
    .map((d, i) => ({ ...d, medal_mean_last: medal(i) }));

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
    text-align: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .podium-image {
  width: 400px;  /* adapte selon ta taille */
  height: auto;
  display: block;
}

.podium-text {
  position: absolute;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  pointer-events: none;
}

/* Positionnement précis des 3 textes */
.text-1 {
  font-size: 1.4rem;
  top: 10px;  
  left: 50%;
  transform: translateX(-50%);
}

.text-2 {
  font-size: 1rem;
  top: 85px;    
  left: 19%;
  transform: translateX(-50%);
}

.text-3 {
  font-size: 0.8rem;
  top: 120px;    
  left: 83%;
  transform: translateX(-50%);
}

.text-4 {
  font-size: 0.5rem;
  position: absolute;      /* Assure-toi que c'est bien positionné */
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
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
    font-size: 1.5rem;
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
    font-size: 0.75rem;
    margin: 0.18rem 0;
    color: #13171F;
  }

  .score-table {
  width: 100%;
  max-width: 100%;
  font-size: 0.70rem;
  background-color: #fff;
  table-layout: fixed;

}
  
  .score-text small {
    font-size: 0.60rem;
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
  