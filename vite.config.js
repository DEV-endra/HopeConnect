import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // Load only VITE_ variables

  console.log(env); // Debug: Print loaded environment variables

  return {
    plugins: [react()],
    define: {
      "process.env": env, // Ensure env variables are injected
    },
    server: {
      allowedHosts: ["hopeconnect.onrender.com", "hopeconnect_backend.onrender.com"], // Allow the backend host
    },
  };
});
