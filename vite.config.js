import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const useAzure = env.USE_AZURE === "true";

  const targetUrl = useAzure
    ? "https://ca-trackr.salmontree-f4468a82.swedencentral.azurecontainerapps.io"
    : "http://localhost:8080";

  return {
    base: "/",

    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

    server: {
      proxy: {
        "/api": {
          target: targetUrl,
          changeOrigin: true,
          secure: !useAzure, // false for localhost HTTP, true for Azure HTTPS
        },
      },
    },
  };
});
