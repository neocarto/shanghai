<template>


  <div class="scores-page">
    <h1><ins>Classement glissant</ins></h1>
    <p>Sur les 10 dernières parties</p>
  <div v-if="stats.length == 0">
    <h1>Début de saison, repassez plus tard !</h1>
  </div>
  <div v-if="stats.length > 0">
      <div class="podium" v-if="stats.length >= 3" style="position: relative; display: inline-block;">
        <img src="/img/podium.webp" alt="Podium" class="podium-image" />
        <div class="podium-text text-1">{{ stats[0].name }}<span style="font-size: 0.5rem;"> ({{ stats[0].mean_last }})</span></div>
        <div class="podium-text text-2">{{ stats[1].name }}<span style="font-size: 0.5rem;"> ({{ stats[1].mean_last }})</span></div>
        <div class="podium-text text-3">{{ stats[2].name }}<span style="font-size: 0.5rem;"> ({{ stats[2].mean_last }})</span></div>
        <div class="podium-text text-4">Chocolat : {{ stats[3].name }} ({{ stats[3].mean_last }})</div>

      </div>
  <div align = "center">    <div class="player-card " v-html="convertToTableString2(stats)"></div></div>
      <h1><ins>Classement de la saison</ins></h1>
      <p>Moyenne des 10 meilleurs scores</p>

      <div v-if="stats.length" class="players-list">

        <div class="player-card" v-html="convertToTableString(rank)"></div>

        <h1><ins>Fiches individuelles</ins></h1>

        <div v-for="(score, index) in stats" :key="index" class="player-card">
          <h2 class="player-name">
            {{ score.medal_mean_last }}
            {{ score.name }} - <small>{{ score.mean_last }} pts</small>
          </h2>
          <div class="last-scores">
    <!-- <template v-for="(s, i) in score.data_last" :key="i">
      <strong v-if="i === 0">{{ s }}</strong>
      <span v-else>{{ s }}</span>
      <span v-if="i < score.data_last.length - 1">, </span>
    </template> -->
          </div>

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
              <tr><th>Parties</th><td>{{ score.played_last }}</td><td>{{ score.played_year }}</td><td>{{ score.played_all }}</td></tr>
              <tr><th>Win</th><td>{{ Math.round(score.win_last * 10)/10 }} %</td><td>{{ Math.round(score.win_year * 10)/10 }} %</td><td>{{ Math.round(score.win_all * 10)/10 }} %</td></tr>
              <tr><th>Assiduité</th><td>-</td><td>{{ score.assiduity_year }} %</td><td>{{ score.assiduity_all }} %</td></tr>
              <tr><th>Moyenne</th><td>{{ score.mean_last }} {{ score.medal_mean_last }}</td><td>{{ score.mean_year }} {{ score.medal_mean_year }}</td><td>{{ score.mean_all }} {{ score.medal_mean_all }}</td></tr>
              <tr><th>Cumul</th><td>{{ Math.round(score.cumul_last/100)/10 + "K" }} {{ score.medal_cumul_last }}</td><td>{{ Math.round(score.cumul_year/100)/10 + "K" }} {{ score.medal_cumul_year }}</td><td>{{ Math.round(score.cumul_all/100)/10 + "K" }} {{ score.medal_cumul_all }}</td></tr>
              <tr><th>Meilleur</th><td>{{ score.max_last }} {{ score.medal_max_last }}</td><td>{{ score.max_year }} {{ score.medal_max_year }}</td><td>{{ score.max_all }} {{ score.medal_max_all }}</td></tr>
              <tr><th>Streak</th><td>{{ score.streak_last }} {{ score.medal_streak_last }}</td><td>{{ score.streak_year }} {{ score.medal_streak_year }}</td><td>{{ score.streak_all }} {{ score.medal_streak_all }}</td></tr>
              <tr><th>Streak Loose</th><td>{{ score.streakloose_last }} {{ score.medal_streakloose_last }}</td><td>{{ score.streakloose_year }} {{ score.medal_streakloose_year }}</td><td>{{ score.streakloose_all }} {{ score.medal_streakloose_all }}</td></tr>
              <tr><th>Hits <small>(60)</small></th><td>{{ score.hits_last }} {{ score.medal_hits_last }}</td><td>{{ score.hits_year }} {{ score.medal_hits_year }}</td><td>{{ score.hits_all }} {{ score.medal_hits_all }}</td></tr>
              <tr><th>Hits <small>(180)</small></th><td>{{ score.hits2_last }} {{ score.medal_hits2_last }}</td><td>{{ score.hits2_year }} {{ score.medal_hits2_year }}</td><td>{{ score.hits2_all }} {{ score.medal_hits2_all }}</td></tr>
              <tr><th>Meilleur coup</th><td>{{ score.hitbest_last }} {{ score.medal_hitbest_last }}</td><td>{{ score.hitbest_year }} {{ score.medal_hitbest_year }}</td><td>{{ score.hitbest_all }} {{ score.medal_hitbest_all }}</td></tr>
              <tr><th>Triples</th><td>{{ score.triple_last }} % {{ score.medal_triple_last }}</td><td>{{ score.triple_year }} % {{ score.medal_triple_year }}</td><td>{{ score.triple_all }} % {{ score.medal_triple_all }}</td></tr>
              <tr><th>Doubles</th><td>{{ score.double_last }} % {{ score.medal_double_last }}</td><td>{{ score.double_year }} % {{ score.medal_double_year }}</td><td>{{ score.double_all }} % {{ score.medal_double_all }}</td></tr>
              <tr><th>Shanghai</th><td>{{ score.shanghai_last }}</td><td>{{ score.shanghai_year }}</td><td>{{ score.shanghai_all }}</td></tr>
              <tr><th>ttt</th><td>{{ score.ttt_last }}</td><td>{{ score.ttt_year }}</td><td>{{ score.ttt_all }}</td></tr>
              <tr><th>tt</th><td>{{ score.tt_last }}</td><td>{{ score.tt_year }}</td><td>{{ score.tt_all }}</td></tr>
              <tr><th>ddd</th><td>{{ score.ddd_last }}</td><td>{{ score.ddd_year }}</td><td>{{ score.ddd_all }}</td></tr>
              <tr><th>dd</th><td>{{ score.dd_last }}</td><td>{{ score.dd_year }}</td><td>{{ score.dd_all }}</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Carte spéciale pour Number One -->
        <div class="player-card">
          <h2 class="player-name">{{ numberOne.name }}</h2>
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
              <tr><th>Parties</th><td>{{ numberOne.played_last }}</td><td>{{ numberOne.played_year }}</td><td>{{ numberOne.played_all }}</td></tr>
              <tr><th>Moyenne</th><td>{{ numberOne.mean_last }}</td><td>{{ numberOne.mean_year }}</td><td>{{ numberOne.mean_all }}</td></tr>
              <tr><th>Meilleur</th><td>{{ numberOne.max_last }}</td><td>{{ numberOne.max_year }}</td><td>{{ numberOne.max_all }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <button @click="$emit('back')" class="back-button">Retour</button>
  </div>
</template>

  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../supabase';
  import { min, max, mean, sum, ascending, descending, count, group } from 'd3-array';
  const d3 = Object.assign({}, { min, max, mean, sum, ascending, descending, count, group });
  import {streak, streakLoose, getTimestamps, convertToTableString, convertToTableString2, getBest10, win, shangai, tt, ttt, dd, ddd, medal} from '../helpers/computeStats';
  
  const stats = ref([]);
  const numberOne = ref([]);
  const rank = ref([]);
  
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

const intervall = getTimestamps();


const validPlayers = Array.from(d3.group(data, (d) => d.player_id))
    .filter(([k, v]) => v.length >= 10)
    .filter(([k, v]) => v.player_id != 0) // Filtrer numberOne
    .map(([k]) => k)
const result = getstats(data.filter((d) => validPlayers.includes(d.player_id)));
rank.value = getBest10(data.filter((d) => d.timestamp >= intervall.septFirstLastYear)   .filter((d) => d.timestamp <= intervall.july31Next))

const remove = ["Number One"];
stats.value = result.filter(d => d.data_last.length >=10).filter(d => !remove.includes(d.name))

numberOne.value = result.find(d => d.name === "Number One");
  
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
    const data_last =   data_year.slice().sort((a, b) => d3.ascending(a.timestamp, b.timestamp)).slice(-last);

    // Win
 const playerName = d.name;
const win_all =  win( playerName, data, scores)
const win_year =  win( playerName, data_year, scores)
const win_last =  win( playerName, data_last, scores)


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

        // StreakLoose
        const streakloose_all = d3.max(
      data.map((d) => JSON.parse(d.hits).flat()).map((d) => streakLoose(d))
    );
    const streakloose_year = d3.max(
      data_year.map((d) => JSON.parse(d.hits).flat()).map((d) => streakLoose(d))
    );
    const streakloose_last = d3.max(
      data_last.map((d) => JSON.parse(d.hits).flat()).map((d) => streakLoose(d))
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
      win_all,
      win_year,
      win_last,  
      data_last : data_last.map(d => d.score),
      streakloose_all,
      streakloose_year,
      streakloose_last, 
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
    .sort((a, b) => b["streakloose_all"] - a["streakloose_all"])
    .map((d, i) => ({ ...d, medal_streakloose_all: medal(i) }));
    players = [...players]
    .sort((a, b) => b["streakloose_year"] - a["streakloose_year"])
    .map((d, i) => ({ ...d, medal_streakloose_year: medal(i) }));
     players = [...players]
    .sort((a, b) => b["streakloose_last"] - a["streakloose_last"])
    .map((d, i) => ({ ...d, medal_streakloose_last: medal(i) }));


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
    align-items: center;
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
    font-size: 0.75rem;
    color: #555;
  }
  
  .back-button {
  display: block;
  margin: 2rem auto 0 auto;
  padding: 0.55rem 1.4rem;
  background-color: #0288d1;
  color: white;
  font-weight: 609	408	405	400	460.8
Robull	507	493	478	473	465	418	418	417	405	404	447.8
Dart Simpson	502	444	434	427	423	412	410	398	381	364	419.5
Darts Vador	453	434	433	417	394	392	385	351	327	319	390.5
Angelo	385	383	379	290	287	285	278	278	268	255	308.8
Cramomille	330	310	266	256	254	241	207	191	183	174	241.2
00;
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


  .last-scores {
  width: 100%;
  max-width: 100%;
  font-size: 0.70rem;
  padding-bottom: 10px;

}
  </style>
  