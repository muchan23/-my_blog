import { defineConfig, type Plugin } from "vite";
import ssg from "@hono/vite-ssg";
import devServer from "@hono/vite-dev-server";
import fs from "node:fs";
import path from "node:path";

// feed.xml.html を feed.xml にリネームするプラグイン
function renameFeedPlugin(): Plugin {
  return {
    name: "rename-feed",
    closeBundle() {
      const feedHtml = path.join("dist", "feed.xml.html");
      const feedXml = path.join("dist", "feed.xml");
      if (fs.existsSync(feedHtml)) {
        fs.renameSync(feedHtml, feedXml);
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins:
    mode === "production"
      ? [
          ssg({
            entry: "./src/app.tsx",
          }),
          renameFeedPlugin(),
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
