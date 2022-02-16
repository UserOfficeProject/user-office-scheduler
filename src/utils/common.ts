export const getArrayOfIdsFromQuery = (query: string | null) => {
  const queryArray = query?.split(',');
  const queryIds = queryArray?.map((item) => parseInt(item));

  return queryIds || [];
};

export function comaSeparatedArrayValues<T>(
  array: T[],
  propertyToShow: keyof T
) {
  return array.length
    ? array.map((item, index) => `${index ? ', ' : ''} ${item[propertyToShow]}`)
    : '-';
}
