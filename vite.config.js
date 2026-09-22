// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   root:"src",
//   plugins: [
//     react({
//       babel: {
//         plugins: [['babel-plugin-react-compiler']],
//       },
//     }),
//   ],
//    build: {
//     outDir: "../dist",
//     emptyOutDir: true,
//   },
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src",

  plugins: [react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),],
    assetsInclude: ['**/*.xlsx'],
  esbuild: {
    loader: "jsx",
    include: [
      // allow JSX in .js and .jsx inside src
      /src\/.*\.(js|jsx)$/,
    ],
  },
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@main": path.resolve(__dirname, "src/main.jsx"),
      "@store": path.resolve(__dirname, "src/store"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ["./src"],
        additionalData: `
        @use "sass:color";
        @use "sass:list";
        @use "styles/_functions" as *;
        @use "styles/_variables" as *;
      `,
      },
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
