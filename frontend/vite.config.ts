import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [svgr(), react(), tsconfigPaths()],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes("node_modules")) {
    //         return id.toString().split("node_modules/")[1].split("/")[0].toString()
    //       }
    //     },
    //   },
    // },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
})
