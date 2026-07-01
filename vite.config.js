import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/", 

    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

    server: {
      proxy: {
        // Points local 'http://localhost:5173/api' requests to local C# backend
        // Only used when running backend locally at port 5001
        "/api": {
          target: "http://localhost:5001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});