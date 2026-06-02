import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/lib/tests/setupTests.ts",
    globals: true,
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:3000",
    },
  },
});
