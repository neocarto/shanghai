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
