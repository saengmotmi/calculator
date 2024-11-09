import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // 전역 expect, describe 등의 함수 사용 가능
    environment: "jsdom", // JSDOM 환경 설정
    setupFiles: "./src/tests/setupTests.mjs",
  },
});
