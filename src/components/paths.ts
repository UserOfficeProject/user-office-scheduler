const PUBLIC_URL = process.env.PUBLIC_URL
  ? process.env.PUBLIC_URL === '/'
    ? ''
    : process.env.PUBLIC_URL
  : '';

export const PATH_ROOT = PUBLIC_URL + '/';
export const PATH_CALENDAR = PUBLIC_URL + '/calendar';
export const PATH_NOT_AUTHENTICATED = PUBLIC_URL + '/not-authenticated';
