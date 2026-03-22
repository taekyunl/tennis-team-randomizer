import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = '/tennis-team-randomizer/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
  plugins: [react()],
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2021',
        useDefineForClassFields: true,
        jsx: 'react-jsx',
      },
    },
  },
  test: {
    environment: 'node',
  },
}));
