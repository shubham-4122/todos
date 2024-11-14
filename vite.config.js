/* eslint-disable import/default */
import { defineConfig } from 'vite';
import analyze from 'rollup-plugin-analyzer';
import eslintPlugin from 'vite-plugin-eslint';
const path = require('path');

export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [analyze()],
    },
  },
  plugins: [
    eslintPlugin({
      cache: false,
      include: ['./src/**/*.js', './src/**/*.jsx'],
      exclude: [],
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      actions: path.resolve(__dirname, './src/actions'),
      lib: path.resolve(__dirname, './src/lib'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
});
