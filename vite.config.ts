import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ishansehgal.github.io/", // 👈 this fixes the MIME/path issue
  plugins: [
    react(),
    componentTagger({
      src: path.join(__dirname, "src"),
      out: path.join(__dirname, "src/components.json"),
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    }),
  ],
});
