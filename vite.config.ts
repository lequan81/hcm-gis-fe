import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: '/hcm-gis',
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "HCMC 3D Building Tiles",
        short_name: "HCMC Tiles",
        description: "Download MVT building tiles from HCMC server",
        theme_color: "#0c0f1a",
        background_color: "#0c0f1a",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/hcm-gis\/api/],
        runtimeCaching: [
          {
            urlPattern: /^\/hcm-gis\/api\//,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/hcm-gis/api": {
        target: "http://localhost:3001",
        rewrite: (path: string) => path.replace(/^\/hcm-gis/, ""),
      },
    },
  },
});
