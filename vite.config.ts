import { defineConfig } from "vite";
import ssg from "@hono/vite-ssg";
import devServer from "@hono/vite-dev-server";

export default defineConfig(({ mode }) => ({
  plugins:
    mode === "production"
      ? [
          ssg({
            entry: "./src/app.tsx",
          }),
        ]
      : [
          devServer({
            entry: "./src/app.tsx",
          }),
        ],
  build: {
    outDir: "dist",
  },
}));
