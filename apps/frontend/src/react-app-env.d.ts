/// <reference types="vite/client" />

declare module 'moment/locale/en-gb' {
  import moment from 'moment';
  export default moment;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
