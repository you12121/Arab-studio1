// vite.config.ts (النسخة النهائية النظيفة)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode } ) => ({
  // المسار الصحيح لموقعك على GitHub Pages
  base: mode === 'production' ? '/Arab-studio1/' : '/',

  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // تم إزالة lovable-tagger من هنا
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
