import { describe, expect, test } from "bun:test";

import type { Viewport } from "../types/metadata-interface";
import { normalizeViewport, normalizeViewportLayout } from "./viewport";

describe("normalizeViewport", () => {
	test("returns null when viewport is falsy", () => {
		const result = normalizeViewport(null);

		expect(result).toBeNull();
	});

	test("normalizes themeColor entries and layout fields", () => {
		const result = normalizeViewport({
			width: "device-width",
			initialScale: 1,
			userScalable: false,
			themeColor: [
				{ color: "#000000" },
				{ color: "#ffffff", media: "(prefers-color-scheme: light)" },
			],
			colorScheme: "dark",
		});

		expect(result).toEqual({
			themeColor: [
				{ color: "#000000" },
				{ color: "#ffffff", media: "(prefers-color-scheme: light)" },
			],
			colorScheme: "dark",
			width: "device-width",
			initialScale: 1,
			userScalable: false,
		});
	});

	test("handles empty themeColor array", () => {
		const result = normalizeViewport({
			themeColor: [],
		});

		expect(result).toEqual({
			themeColor: [],
			colorScheme: null,
		});
	});

	test("normalizes themeColor descriptor objects", () => {
		const result = normalizeViewport({
			themeColor: [{ color: "#000", media: "(prefers-color-scheme: dark)" }],
		});

		expect(result).toEqual({
			themeColor: [{ color: "#000", media: "(prefers-color-scheme: dark)" }],
			colorScheme: null,
		});
	});

	test("returns null themeColor when undefined", () => {
		const result = normalizeViewport({
			themeColor: undefined,
		});

		expect(result).toEqual({
			themeColor: null,
			colorScheme: null,
		});
	});

	test("preserves layout-only properties", () => {
		const result = normalizeViewport({
			width: "device-width",
			height: 600,
		});

		expect(result).toEqual({
			themeColor: null,
			colorScheme: null,
			width: "device-width",
			height: 600,
		});
	});

	test.each([
		"dark",
		"light",
		"dark light",
	] as const)("handles valid colorScheme value: %s", (colorScheme) => {
		const result = normalizeViewport({
			colorScheme,
		});

		expect(result?.colorScheme).toBe(colorScheme);
	});

	test("coerces string themeColor to descriptor array", () => {
		const result = normalizeViewport({
			themeColor: "#123",
		});

		expect(result).toEqual({
			themeColor: [{ color: "#123" }],
			colorScheme: null,
		});
	});

	test("falls back to null for empty colorScheme", () => {
		const result = normalizeViewport({
			// Intentionally invalid to assert fallback behavior
			colorScheme: "" as unknown as "dark",
		});

		expect(result).toEqual({
			themeColor: null,
			colorScheme: null,
		});
	});
});

describe("normalizeViewportLayout", () => {
	test("builds comma-separated viewport string with mapped keys", () => {
		const result = normalizeViewportLayout({
			width: "device-width",
			height: 800,
			initialScale: 1,
			minimumScale: 0.5,
			maximumScale: 2,
			viewportFit: "cover",
			userScalable: false,
			interactiveWidget: "resizes-content",
		});

		expect(result).toBe(
			"width=device-width, height=800, initial-scale=1, minimum-scale=0.5, maximum-scale=2, viewport-fit=cover, user-scalable=no, interactive-widget=resizes-content",
		);
	});

	test("returns single entry for individual layout property", () => {
		const result = normalizeViewportLayout({
			width: "device-width",
		});

		expect(result).toBe("width=device-width");
	});

	test("converts userScalable boolean to yes", () => {
		const result = normalizeViewportLayout({
			userScalable: true,
		});

		expect(result).toBe("user-scalable=yes");
	});

	test("omits initialScale when zero", () => {
		const result = normalizeViewportLayout({
			initialScale: 0,
		});

		expect(result).toBe("");
	});

	test("returns empty string for empty viewport object", () => {
		const result = normalizeViewportLayout({});

		expect(result).toBe("");
	});

	test("gracefully handles null viewport input", () => {
		const result = normalizeViewportLayout(null as unknown as Viewport);

		expect(result).toBeNull();
	});
});
