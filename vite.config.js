import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Checks if "npm run dev:oracle" ran locally
  const useOracle = env.USE_ORACLE === "true";

  // Local development routing targets
  const targetUrl = useOracle
    ? "https://api.trackr-v2.me"
    : "http://localhost";

  return {
    base: "/",

    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

    server: {
      proxy: {
        "/api": {
          target: targetUrl,
          changeOrigin: true,
          secure: false, // Disables strict local SSL checks so localhost dev server can connect smoothly
        },
      },
    },
  };
});
