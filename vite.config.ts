import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function previewApiNotice(): Plugin {
  return {
    name: "pathfinder-preview-api-notice",
    configureServer(server) {
      server.middlewares.use("/api", (_request, response) => {
        response.statusCode = 503;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(JSON.stringify({ error: "The Preview has no Supabase connection. Configure the Supabase project and use Vercel's development runtime to test real saving." }));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), previewApiNotice()],
  server: { host: "0.0.0.0", port: 3000, strictPort: true },
  preview: { host: "0.0.0.0", port: 3000, strictPort: true },
  build: { sourcemap: false },
});
