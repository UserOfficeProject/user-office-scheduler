export function isSetAndPopulated<T>(
  itemToCheck?: T | T[]
): itemToCheck is T | T[] {
  return !!itemToCheck && !!Object.keys(itemToCheck).length;
}
