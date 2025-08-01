import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      host: true, // use "true" instead of "::" for IPv4+IPv6 compatibility
      port: 8080,
    },
    plugins: [
      react()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
