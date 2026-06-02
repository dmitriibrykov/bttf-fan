import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeAll, afterAll, afterEach, vi } from "vitest";
import { server } from "./server";

beforeAll(() => server.listen());

// Automatically cleanup after each test
afterEach(() => {
  console.log("resetting");
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
