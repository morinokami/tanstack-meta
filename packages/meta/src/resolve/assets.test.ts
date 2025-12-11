import { describe, expect, test } from "bun:test";

import { resolveAssets } from "./assets";

describe("resolveAssets", () => {
	describe("without baseUrl", () => {
		test("returns assets unchanged when baseUrl is not provided", () => {
			const result = resolveAssets({ assets: "/assets" });

			expect(result).toBe("/assets");
		});

		test("returns assets unchanged when baseUrl is null", () => {
			const result = resolveAssets({ assets: "/assets" }, null);

			expect(result).toBe("/assets");
		});

		test("returns undefined when assets is not provided", () => {
			const result = resolveAssets({});

			expect(result).toBeUndefined();
		});

		test("returns null when assets is null", () => {
			const result = resolveAssets({ assets: null });

			expect(result).toBeNull();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative assets path to absolute URL", () => {
			const result = resolveAssets({ assets: "/assets" }, baseUrl);

			expect(result).toBe("https://example.com/assets");
		});

		test("resolves relative assets path without leading slash", () => {
			const result = resolveAssets({ assets: "assets" }, baseUrl);

			expect(result).toBe("https://example.com/assets");
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveAssets(
				{ assets: "https://cdn.example.com/assets" },
				baseUrl,
			);

			expect(result).toBe("https://cdn.example.com/assets");
		});

		test("handles URL object as baseUrl", () => {
			const result = resolveAssets(
				{ assets: "/assets" },
				new URL("https://example.org"),
			);

			expect(result).toBe("https://example.org/assets");
		});

		test("resolves nested path", () => {
			const result = resolveAssets({ assets: "/public/assets" }, baseUrl);

			expect(result).toBe("https://example.com/public/assets");
		});
	});

	describe("with array of assets", () => {
		const baseUrl = "https://example.com";

		test("resolves array of relative paths", () => {
			const result = resolveAssets(
				{ assets: ["/assets/css", "/assets/js"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://example.com/assets/css",
				"https://example.com/assets/js",
			]);
		});

		test("preserves absolute URLs in array", () => {
			const result = resolveAssets(
				{ assets: ["https://cdn.example.com/assets", "/local/assets"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://cdn.example.com/assets",
				"https://example.com/local/assets",
			]);
		});

		test("returns array unchanged when baseUrl is not provided", () => {
			const result = resolveAssets({ assets: ["/assets/css", "/assets/js"] });

			expect(result).toEqual(["/assets/css", "/assets/js"]);
		});
	});
});
