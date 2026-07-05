import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const useOracle = env.USE_ORACLE === "true";

  const targetUrl = useOracle
    ? "https://api.trackr-v2.me"
    : "http://localhost:8080";

  return {
    base: "/",

    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

    server: {
      proxy: {
        "/api": {
          target: targetUrl,
          changeOrigin: true,
          secure: !useOracle, // false for localhost HTTP, true for Oracle HTTPS
        },
      },
    },
  };
});
