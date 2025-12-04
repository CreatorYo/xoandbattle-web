import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { pwaConfig } from './vite-pwa.config';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 2235,
  },
  plugins: [
    react(),
    VitePWA(pwaConfig)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
