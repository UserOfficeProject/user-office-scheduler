export const getArrayOfIdsFromQuery = (query: string | null) => {
  const queryArray = query?.split(',');
  const queryIds = queryArray?.map((item) => parseInt(item));

  return queryIds || [];
};
