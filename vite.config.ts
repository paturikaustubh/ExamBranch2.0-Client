import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

config({ path: __dirname + "/.env" });
const { SERVER_IP } = process.env;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `http://${SERVER_IP}:6969/`,
        changeOrigin: true,
      },
    },
  },
});
