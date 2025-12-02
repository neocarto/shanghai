import { getTimestamps } from "./timestamp.js";
import * as d3 from "d3";

export function last(scores, nb = 10) {
  const intervall = getTimestamps();
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  //return oneMonthAgo;

  let result = scores
    .filter((d) => d.timestamp >= intervall.septFirstLastYear)
    .filter((d) => d.timestamp <= intervall.july31Next)
    .sort((a, b) => d3.ascending(a.timestamp, b.timestamp));

  let players = [...new Set(result.map((d) => d.name))].filter(
    (d) => d !== "Number One"
  );

  let output = players.map((d) =>
    result
      .filter((e) => e.name == d)
      //.filter((d) => new Date(d.timestamp) >= oneMonthAgo)
      .slice(-nb)
  );

  //return output;
  let final;
  output[0].map((d) => d.timestamp).at(-1) >= oneMonthAgo
    ? (final = output.flat())
    : (final = []).filter((d) => d.length >= 10);

  return final;
}
