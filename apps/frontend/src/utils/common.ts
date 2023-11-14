export const getArrayOfIdsFromQuery = (query: string | null) => {
  const queryArray = query?.split(',');
  const queryIds = queryArray?.map((item) => parseInt(item));

  return queryIds || [];
};

export const getNumberFromQuery = (query: string | null) => {
  if (query) {
    return +query;
  } else {
    return null;
  }
};

export function comaSeparatedArrayValues<T>(
  array: T[] | null,
  propertyToShow: keyof T
) {
  return array?.length
    ? array.map((item, index) => `${index ? ', ' : ''} ${item[propertyToShow]}`)
    : '-';
}
