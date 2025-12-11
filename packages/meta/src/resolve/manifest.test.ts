import { describe, expect, test } from "bun:test";

import { resolveManifest } from "./manifest";

describe("resolveManifest", () => {
	describe("without baseUrl", () => {
		test("returns manifest unchanged when baseUrl is not provided", () => {
			const result = resolveManifest({ manifest: "/manifest.json" });

			expect(result).toBe("/manifest.json");
		});

		test("returns manifest unchanged when baseUrl is null", () => {
			const result = resolveManifest({ manifest: "/manifest.json" }, null);

			expect(result).toBe("/manifest.json");
		});

		test("returns undefined when manifest is not provided", () => {
			const result = resolveManifest({});

			expect(result).toBeUndefined();
		});

		test("returns null when manifest is null", () => {
			const result = resolveManifest({ manifest: null });

			expect(result).toBeNull();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative manifest path to absolute URL", () => {
			const result = resolveManifest({ manifest: "/manifest.json" }, baseUrl);

			expect(result).toBe("https://example.com/manifest.json");
		});

		test("resolves relative manifest path without leading slash", () => {
			const result = resolveManifest({ manifest: "manifest.json" }, baseUrl);

			expect(result).toBe("https://example.com/manifest.json");
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveManifest(
				{ manifest: "https://cdn.example.com/manifest.json" },
				baseUrl,
			);

			expect(result).toBe("https://cdn.example.com/manifest.json");
		});

		test("handles URL object as manifest", () => {
			const result = resolveManifest(
				{ manifest: new URL("/manifest.json", "https://localhost") },
				baseUrl,
			);

			expect(result).toBe("https://localhost/manifest.json");
		});

		test("handles URL object as baseUrl", () => {
			const result = resolveManifest(
				{ manifest: "/manifest.json" },
				new URL("https://example.org"),
			);

			expect(result).toBe("https://example.org/manifest.json");
		});

		test("resolves nested path", () => {
			const result = resolveManifest(
				{ manifest: "/public/manifest.json" },
				baseUrl,
			);

			expect(result).toBe("https://example.com/public/manifest.json");
		});
	});
});
