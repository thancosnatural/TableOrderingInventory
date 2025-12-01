// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   base: "/",
//   plugins: [react(), tailwindcss()],
//   build: {
//     target: "esnext", 
//     sourcemap: false, 
//     chunkSizeWarningLimit: 1000, 
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             return id
//               .toString()
//               .split("node_modules/")[1]
//               .split("/")[0]
//               .toString();
//           }
//         },
//       },
//     },
//   },
//   server: {
//     host: "0.0.0.0",
//     port: 5173,
//   },
// });







import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // 👈 import path

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 define alias here
    },
  },
  build: {
    target: "esnext",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
