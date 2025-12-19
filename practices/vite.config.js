import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    hmr: {
      overlay: false,
    },
    historyApiFallback: true, // <-- this fixes refresh issue
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setUptesting.js",
  },
});
