import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.PORT || 33000);

  return {
    plugins: [react()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/gateway': {
          target: 'http://localhost:4100',
          changeOrigin: true,
        },
        '/graphql': {
          target: 'http://localhost:4100',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port,
    },
  };
});
