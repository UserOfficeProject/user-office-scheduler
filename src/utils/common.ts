export function comaSeparatedArrayValues<T>(
  array: T[],
  propertyToShow: keyof T
) {
  return array.length
    ? array.map((item, index) => `${index ? ', ' : ''} ${item[propertyToShow]}`)
    : '-';
}
