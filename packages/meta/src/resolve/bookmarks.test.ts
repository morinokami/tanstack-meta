import { describe, expect, test } from "bun:test";

import { resolveBookmarks } from "./bookmarks";

describe("resolveBookmarks", () => {
	describe("without baseUrl", () => {
		test("returns bookmarks unchanged when baseUrl is not provided", () => {
			const result = resolveBookmarks({ bookmarks: "/bookmarks" });

			expect(result).toBe("/bookmarks");
		});

		test("returns bookmarks unchanged when baseUrl is null", () => {
			const result = resolveBookmarks({ bookmarks: "/bookmarks" }, null);

			expect(result).toBe("/bookmarks");
		});

		test("returns undefined when bookmarks is not provided", () => {
			const result = resolveBookmarks({});

			expect(result).toBeUndefined();
		});

		test("returns null when bookmarks is null", () => {
			const result = resolveBookmarks({ bookmarks: null });

			expect(result).toBeNull();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative bookmarks path to absolute URL", () => {
			const result = resolveBookmarks({ bookmarks: "/bookmarks" }, baseUrl);

			expect(result).toBe("https://example.com/bookmarks");
		});

		test("resolves relative bookmarks path without leading slash", () => {
			const result = resolveBookmarks({ bookmarks: "bookmarks" }, baseUrl);

			expect(result).toBe("https://example.com/bookmarks");
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveBookmarks(
				{ bookmarks: "https://cdn.example.com/bookmarks" },
				baseUrl,
			);

			expect(result).toBe("https://cdn.example.com/bookmarks");
		});

		test("handles URL object as baseUrl", () => {
			const result = resolveBookmarks(
				{ bookmarks: "/bookmarks" },
				new URL("https://example.org"),
			);

			expect(result).toBe("https://example.org/bookmarks");
		});

		test("resolves nested path", () => {
			const result = resolveBookmarks(
				{ bookmarks: "/user/bookmarks" },
				baseUrl,
			);

			expect(result).toBe("https://example.com/user/bookmarks");
		});
	});

	describe("with array of bookmarks", () => {
		const baseUrl = "https://example.com";

		test("resolves array of relative paths", () => {
			const result = resolveBookmarks(
				{ bookmarks: ["/bookmarks/tech", "/bookmarks/news"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://example.com/bookmarks/tech",
				"https://example.com/bookmarks/news",
			]);
		});

		test("preserves absolute URLs in array", () => {
			const result = resolveBookmarks(
				{
					bookmarks: ["https://cdn.example.com/bookmarks", "/local/bookmarks"],
				},
				baseUrl,
			);

			expect(result).toEqual([
				"https://cdn.example.com/bookmarks",
				"https://example.com/local/bookmarks",
			]);
		});

		test("returns array unchanged when baseUrl is not provided", () => {
			const result = resolveBookmarks({
				bookmarks: ["/bookmarks/tech", "/bookmarks/news"],
			});

			expect(result).toEqual(["/bookmarks/tech", "/bookmarks/news"]);
		});
	});
});
