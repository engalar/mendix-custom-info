import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  //react output amd
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        format: "amd",
      },
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
});
