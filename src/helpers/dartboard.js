import * as d3 from "d3";

export function drawDartboard(hits, player = null, size = 800, title = true) {
  const stats = compute(hits);
  const nb = stats.find((d) => d.id == "stats").parties;
  const width = size ?? "100%";
  //const height = size ?? "100%";
  const height = size + 0;
  const vb = size ?? 600;
  const cx = width / 2;
  const cy = height / 2;
  const R = size * 0.45;

  // Radii
  const radii = {
    bullInner: R * 0.07,
    bullOuter: R * 0.16,
    tripleInner: R * 0.4,
    tripleOuter: R * 0.45,
    doubleInner: R * 0.81,
    doubleOuter: R * 0.86,
  };

  const sectorNumbers = [
    11, 14, 9, 12, 5, 20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8,
  ];

  const sectors = 20;
  const angle = (2 * Math.PI) / sectors;

  // Create full sector objects
  const sectorsData = d3.range(sectors).map((i) => {
    const start = -Math.PI / 2 - angle / 2 + i * angle;
    const end = start + angle;
    return {
      index: i,
      number: sectorNumbers[i],
      start,
      end,
    };
  });

  // SVG
  const svg = d3
    .create("svg")
    //.attr("viewBox", `0 0 ${vb} ${vb}`) // garde les proportions
    .attr("viewBox", `0 0 ${vb} ${vb + 0}`)
    .style("width", "100%")
    .style("height", "100%"); // remplit tout le container

  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", vb)
    .attr("height", vb + 200)
    .attr("fill", "white")
    .attr("rx", 20)
    .attr("ry", 20);
  const offset = title ? 30 : 0;
  const g = svg
    .append("g")
    .attr("transform", `translate(${cx},${cy + offset})`);

  // Arc generator factory
  function arcGen(innerR, outerR) {
    return d3
      .arc()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .startAngle((d) => d.start)
      .endAngle((d) => d.end);
  }

  const stroke = "white";
  const strokeWidth = 1;

  // --- ALL --------------------------------------------------------
  g.selectAll(".segment")
    .data(sectorsData)
    .join("path")
    .attr("class", "segment")
    .attr("id", (d) => `segment-${d.number}`)
    .attr("d", arcGen(radii.bullOuter, radii.doubleOuter))
    .attr("fill", (d) => stats.find((s) => s.id == d.number)?.color)
    //.attr("fill", (d) => (d.number == range ? "red" : "white"))
    .attr("fill-opacity", 1)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);

  // --- SINGLE INNER -------------------------------------------------------
  g.selectAll(".single-inner")
    .data(sectorsData)
    .join("path")
    .attr("class", "single-inner")
    .attr("id", (d) => `single-inner-${d.number}`)
    .attr("d", arcGen(radii.bullOuter, radii.tripleInner))
    .attr("fill", "none")
    //.attr("fill", (d) => (d.number == range ? "red" : "white"))
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);

  // --- SINGLE OUTER -------------------------------------------------------
  g.selectAll(".single-outer")
    .data(sectorsData)
    .join("path")
    .attr("class", "single-outer")
    .attr("id", (d) => `single-outer-${d.number}`)
    .attr("d", arcGen(radii.tripleOuter, radii.doubleInner))
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);

  // --- TRIPLE RING --------------------------------------------------------
  g.selectAll(".triple")
    .data(sectorsData)
    .join("path")
    .attr("class", "triple")
    .attr("id", (d) => `triple-${d.number}`)
    .attr("d", arcGen(radii.tripleInner, radii.tripleOuter))
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);

  // --- DOUBLE RING --------------------------------------------------------
  g.selectAll(".double")
    .data(sectorsData)
    .join("path")
    .attr("class", "double")
    .attr("id", (d) => `double-${d.number}`)
    .attr("d", arcGen(radii.doubleInner, radii.doubleOuter))
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);

  // // --- OUTER BULL ---------------------------------------------------------
  // g.append("circle")
  //   .attr("r", radii.bullOuter)
  //   .attr("class", "outer-bull")
  //   .attr("fill", "none")
  //   .attr("stroke", stroke)
  //   .attr("stroke-width", strokeWidth)
  //   .attr("fill-opacity", 0.2);

  // // --- INNER BULL ---------------------------------------------------------
  // g.append("circle")
  //   .attr("r", radii.bullInner)
  //   .attr("class", "inner-bull")
  //   .attr("fill", "none")
  //   .attr("stroke", stroke)
  //   .attr("stroke-width", strokeWidth)
  //   .attr("fill-opacity", 0.2);

  // --- DOT ON DOUBLES --------------------------------------------
  const doubleRadius = (radii.doubleInner + radii.doubleOuter) / 2;

  g.selectAll(".double-point")
    .data(sectorsData)
    .join("circle")
    .attr("class", "double-point")
    .attr("cx", (d) => {
      const midAngle = -Math.PI / 2 + d.index * angle - Math.PI / 2;
      return Math.cos(midAngle) * doubleRadius;
    })
    .attr("cy", (d) => {
      const midAngle = -Math.PI / 2 + d.index * angle - Math.PI / 2;
      return Math.sin(midAngle) * doubleRadius;
    })
    .attr("r", (d) => {
      const val = stats.find((s) => s.id == d.number)?.double;

      if (nb === 1) {
        return val * 8; // si nb = 1, rayon proportionnel à triple
      } else {
        // nb ≠ 1, on applique la logique de seuils
        if (val < 0.2) {
          return 0;
        } else if (val >= 0.2 && val < 0.3) {
          return 8;
        } else if (val >= 0.3) {
          return 18;
        }
      }
    })

    .attr("fill", "#FFD700")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // .attr("r", 30)
  // .attr("fill", (d) => (d.number == range ? "red" : "none"));

  // --- DOT ON TRIPLES --------------------------------------------
  const tripleRadius = (radii.tripleInner + radii.tripleOuter) / 2;

  g.selectAll(".triple-point")
    .data(sectorsData)
    .join("circle")
    .attr("class", "triple-point")
    .attr("cx", (d) => {
      const midAngle = -Math.PI / 2 + d.index * angle - Math.PI / 2;
      return Math.cos(midAngle) * tripleRadius;
    })
    .attr("cy", (d) => {
      const midAngle = -Math.PI / 2 + d.index * angle - Math.PI / 2;
      return Math.sin(midAngle) * tripleRadius;
    })
    // .attr("r", (d) => stats.find((s) => s.id == d.number)?.triple * 8)

    .attr("r", (d) => {
      const val = stats.find((s) => s.id == d.number)?.triple;

      if (nb === 1) {
        return val * 8; // si nb = 1, rayon proportionnel à triple
      } else {
        // nb ≠ 1, on applique la logique de seuils
        if (val < 0.2) {
          return 0;
        } else if (val >= 0.2 && val < 0.3) {
          return 8;
        } else if (val >= 0.3) {
          return 18;
        }
      }
    })

    .attr("fill", "#FFD700")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // --- NUMBERS ------------------------------------------------------------

  const labelRadius = radii.doubleOuter + 20;

  const labels = g
    .selectAll(".label-group")
    .data(sectorsData)
    .join("g")
    .attr("class", "label-group")
    .attr("id", (d) => `label-${d.number}`)
    .attr("transform", (d) => {
      // Angle central du secteur avec 20 en haut
      const midAngle = -Math.PI / 2 + d.index * angle - Math.PI / 2;
      const x = Math.cos(midAngle) * labelRadius;
      const y = Math.sin(midAngle) * labelRadius;
      return `translate(${x},${y})`;
    });

  // Rectangle derrière le texte
  labels
    .append("circle") // cercle plutôt que rect pour centrer parfaitement
    .attr("r", 15)
    .attr("fill", (d) =>
      stats.find((s) => s.id == d.number)?.shanghai >= 1 ? "black" : "none"
    )
    .attr("stroke", "none");

  // Texte centré dans le cercle
  labels
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", (d) =>
      stats.find((s) => s.id == d.number)?.shanghai >= 1 ? 20 : 16
    )
    .attr("fill", (d) =>
      stats.find((s) => s.id == d.number)?.shanghai >= 1 ? "#FFD700" : "#616161"
    )
    .attr("opacity", (d) =>
      stats.find((s) => s.id == d.number)?.hits >= 0.75 ? 1 : 0
    )
    .attr("font-weight", 600)
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .text((d) => d.number);

  // --- TEXTE AU CENTRE ---------------------------------------------------

  g.append("text")
    .attr("class", "center-text")
    .attr("x", 0)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 32)
    .attr("fill", "#521a3a")
    .attr("font-weight", "bold")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .text(Math.round(stats.find((d) => d.id == "stats").hits) + "/60");

  let f1f2f3 = [0, 0, 0];

  for (const row of nb == 1 ? hits : hits.flat()) {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0) f1f2f3[i]++;
    }
  }
  f1f2f3 = f1f2f3.map((d) => d / nb).map((d) => Math.round(d));

  g.append("text")
    .attr("class", "center-text")
    .attr("x", 0)
    .attr("y", 11)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 20)
    .attr("fill", "#521a3a")
    .attr("font-weight", "bold")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .text("" + f1f2f3.join("|") + "");

  g.append("text")
    .attr("class", "center-text")
    .attr("x", 0)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 16)
    .attr("fill", "#521a3a")
    .attr("font-weight", "bold")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .text("(" + stats.find((d) => d.id == "stats").streak + ")");

  console.log(stats);

  // TEXT AU DESSUS DE LA CIBLE
  if (title) {
    const points =
      Math.round(stats.find((d) => d.id == "stats").score) + " points";
    const text = player ? player + " : " + points : points;
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40) // hauteur depuis le haut
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 40)
      .attr("fill", "#521a3a")
      .attr("font-weight", "bold")
      .attr("font-family", "Arial, Helvetica, sans-serif")
      .text(text);
  }

  return svg.node();
}

// ----------------------------
//
// HELPER FUNCTIONS
//
// ----------------------------

function compute(arr) {
  let nb;
  let result;
  let hits = [];
  let shanghai = null;
  let streakmax = null;
  let colorize;
  if (isUnique(arr)) {
    colorize = colorizeSingle;
    nb = 1;
    hits = arr;
  } else if (isMulti(arr)) {
    colorize = colorizeMulti;
    streakmax = d3.max(arr.map((d) => streak(d)));
    nb = arr.length;
    for (let i = 0; i < 20; i++) {
      let h = arr.map((d) => d[i]);
      hits.push(h);
    }
  }

  if (isMulti(arr)) {
    shanghai = shanghaiCounts(hits);
    hits = hits.map((d) => d.flat());
  }

  result = hits.map((d, i) => {
    const valuesSet = new Set(d);
    return {
      id: i + 1,
      hits: d.filter((v) => v !== 0).length / nb,
      single: d.filter((v) => v === 1).length / nb,
      double: d.filter((v) => v === 2).length / nb,
      triple: d.filter((v) => v === 3).length / nb,
      shanghai: shanghai
        ? shanghai[i]
        : +(valuesSet.has(1) && valuesSet.has(2) && valuesSet.has(3)),
      color: colorize(d.filter((v) => v !== 0).length / nb),
    };
  });

  // Global stats
  result.push({
    id: "stats",
    parties: nb,
    score: score(hits) / nb,
    hits: nbhits(hits) / nb,
    streak: isMulti(arr) ? streakmax : streak(hits),
  });
  return result;
}

function isUnique(arr) {
  // Vérifie que c'est un array de 2 éléments
  if (!Array.isArray(arr) || arr.length !== 20) return false;

  // Vérifie que chaque élément est un array de 3 éléments
  return arr.every((sub) => Array.isArray(sub) && sub.length === 3);
}

function isMulti(arr) {
  // Vérifie que c'est un array
  if (!Array.isArray(arr)) return false;

  // Chaque élément doit être un array de 20 éléments
  return arr.every(
    (subArr) =>
      Array.isArray(subArr) &&
      subArr.length === 20 &&
      subArr.every((inner) => Array.isArray(inner) && inner.length === 3)
  );
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

function nbhits(arr) {
  return arr.flat().filter((d) => d != 0).length;
}

function score(arr) {
  return d3.sum(arr.map((d, i) => d3.sum(d) * (i + 1)));
}

function shanghaiCounts(hits) {
  // hits : Array(20) de Array(N) de Array(3)
  return hits.map((numLancers, i) => {
    const count = numLancers.reduce((acc, lancer) => {
      const valuesSet = new Set(lancer);
      return (
        acc + (valuesSet.has(1) && valuesSet.has(2) && valuesSet.has(3) ? 1 : 0)
      );
    }, 0);

    return count;
  });
}

function colorizeSingle(value) {
  let colors = ["#fcc5c0", "#f768a1", "#7a0177"];

  switch (value) {
    case 0:
      return "#FFFFFF";
    case 1:
      return colors[0];
    case 2:
      return colors[1];
    case 3:
      return colors[2];
    default:
      return "#CCCCCC";
  }
}

function colorizeMulti(value) {
  let colors = [
    "#f2f2f2", // 0.75–1.00 (
    "#fde0dd", // 1.00–1.25
    "#fa9fb5", // 1.25–1.50
    "#ae017e", // 1.50–1.75
    "#49006a", // 1.75–2.00
  ];

  if (value < 0.75) {
    return "white";
  } else if (value >= 0.75 && value < 1.0) {
    return colors[0];
  } else if (value >= 1.0 && value < 1.25) {
    return colors[1];
  } else if (value >= 1.25 && value < 1.5) {
    return colors[2];
  } else if (value >= 1.5 && value < 1.75) {
    return colors[3];
  } else if (value >= 1.75 && value <= 2) {
    return colors[4];
  } else {
    // value > 2
    return colors[4]; // foncé
  }
}
