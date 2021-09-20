export const getNextPattern = (currentPattern: string, patterns: string[]) => {
  const index = patterns.indexOf(currentPattern);
  if (index + 1 === patterns.length) return patterns[0];
  return patterns[index + 1];
};