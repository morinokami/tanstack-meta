import { describe, expect, test } from "bun:test";

import { resolveArchives } from "./archives";

describe("resolveArchives", () => {
	describe("without baseUrl", () => {
		test("returns archives unchanged when baseUrl is not provided", () => {
			const result = resolveArchives({ archives: "/archives" });

			expect(result).toBe("/archives");
		});

		test("returns archives unchanged when baseUrl is null", () => {
			const result = resolveArchives({ archives: "/archives" }, null);

			expect(result).toBe("/archives");
		});

		test("returns undefined when archives is not provided", () => {
			const result = resolveArchives({});

			expect(result).toBeUndefined();
		});

		test("returns null when archives is null", () => {
			const result = resolveArchives({ archives: null });

			expect(result).toBeNull();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative archives path to absolute URL", () => {
			const result = resolveArchives({ archives: "/archives" }, baseUrl);

			expect(result).toBe("https://example.com/archives");
		});

		test("resolves relative archives path without leading slash", () => {
			const result = resolveArchives({ archives: "archives" }, baseUrl);

			expect(result).toBe("https://example.com/archives");
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveArchives(
				{ archives: "https://cdn.example.com/archives" },
				baseUrl,
			);

			expect(result).toBe("https://cdn.example.com/archives");
		});

		test("handles URL object as baseUrl", () => {
			const result = resolveArchives(
				{ archives: "/archives" },
				new URL("https://example.org"),
			);

			expect(result).toBe("https://example.org/archives");
		});

		test("resolves nested path", () => {
			const result = resolveArchives({ archives: "/public/archives" }, baseUrl);

			expect(result).toBe("https://example.com/public/archives");
		});
	});

	describe("with array of archives", () => {
		const baseUrl = "https://example.com";

		test("resolves array of relative paths", () => {
			const result = resolveArchives(
				{ archives: ["/archives/2023", "/archives/2024"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://example.com/archives/2023",
				"https://example.com/archives/2024",
			]);
		});

		test("preserves absolute URLs in array", () => {
			const result = resolveArchives(
				{ archives: ["https://cdn.example.com/archives", "/local/archives"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://cdn.example.com/archives",
				"https://example.com/local/archives",
			]);
		});

		test("returns array unchanged when baseUrl is not provided", () => {
			const result = resolveArchives({
				archives: ["/archives/2023", "/archives/2024"],
			});

			expect(result).toEqual(["/archives/2023", "/archives/2024"]);
		});
	});
});
