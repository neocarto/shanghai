import { getTimestamps } from "./timestamp.js";

export function season(data) {
  const intervall = getTimestamps();
  return data
    .filter((d) => d.timestamp >= intervall.septFirstLastYear)
    .filter((d) => d.timestamp <= intervall.july31Next);
}
