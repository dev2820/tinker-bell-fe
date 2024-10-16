import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import { vercelPreset } from "@vercel/remix/vite";
// import { installGlobals } from "@remix-run/node";

// installGlobals();

export default defineConfig({
  plugins: [
    remix({
      // presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    host: "dev.ticketbell.store",
  },
});
