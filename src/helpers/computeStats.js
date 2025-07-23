import { mean, descending } from "d3-array";
const d3 = Object.assign({}, { mean, descending });

export function streak(arr) {
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

export function streakLoose(arr) {
  arr = arr.flat();
  let maxLength = 0;
  let currentLength = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      currentLength++;
      if (currentLength > maxLength) {
        maxLength = currentLength;
      }
    } else {
      currentLength = 0;
    }
  }
  return maxLength;
}

export function getTimestamps() {
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
    july31Next: timestampJuly31,
  };
}

export function shangai(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[1] === 1 && counts[2] === 1 && counts[3] === 1;
  }).length;
}

export function tt(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[3] === 2;
  }).length;
}

export function ttt(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[3] === 3;
  }).length;
}

export function dd(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[2] === 2;
  }).length;
}

export function ddd(arr) {
  return arr.filter((turn) => {
    const counts = [0, 0, 0, 0];
    turn.forEach((d) => counts[d]++);
    return counts[2] === 3;
  }).length;
}

export function win(player, data, scores) {
  let parties = scores
    .filter((d) => data.map((e) => e.timestamp).includes(d.timestamp))
    .map((d) => ({ timestamp: d.timestamp, name: d.name, score: d.score }));
  //return parties;
  let count = 0;
  data
    .map((d) => d.timestamp)
    .forEach((d) => {
      const winner = parties
        .filter((e) => e.timestamp == d)
        .slice()
        .sort((a, b) => d3.descending(a.score, b.score))
        .map((d) => d)[1].name;
      if (winner == player) {
        count++;
      }
    });
  return (count / data.length) * 100;
}

export function getBest10(scores) {
  const players = [...new Set(scores.map((d) => d.name))];
  let best10 = [];
  players.forEach((d) => {
    const arr = scores
      .filter((e) => e.name == d)
      .map((d) => d.score)
      .sort((a, b) => b - a)
      .slice(0, 10);
    best10.push({ name: d, scores: arr, mean: d3.mean(arr) });
  });

  let result = best10
    .filter((d) => d.scores.length >= 10)
    .sort((a, b) => b.mean - a.mean);

  return result.filter((d) => d.name !== "Number One");
}

export function convertToTableString(data) {
  let html = "<table>";
  html += "<tbody>";
  [...data].forEach((player, i) => {
    // Ligne principale avec nom et moyenne
    html += `<tr><td>${medal(i + 1)} ${player.name}</td><td>${
      player.mean
    }</td></tr>`;

    // Ligne avec les 10 scores
    if (player.scores && player.scores.length) {
      const scores = player.scores.sort().join(", ");
      html += `<tr><td colspan="2" style="font-size: 0.75em; color: #666;">${scores}</td></tr>`;
    }
  });
  html += "</tbody>";

  html += "</table>";
  return html;
}

export function convertToTableString2(data) {
  let html = "<table>";
  html += "<tbody>";
  [...data].forEach((player, i) => {
    html += `<tr><td>${medal(i + 1)} ${player.name}</td><td>${
      player.mean_last
    }</td></tr>`;

    // Ligne avec les 10 scores
    if (player.data_last && player.data_last.length) {
      const scores = player.data_last.join(", ");
      html += `<tr><td colspan="2" style="font-size: 0.75em; color: #666;">${scores}</td></tr>`;
    }
  });
  html += "</tbody>";

  html += "</table>";
  return html;
}

export function medal(rank) {
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
