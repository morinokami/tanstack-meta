import { describe, expect, test } from "bun:test";

import {
	createArrayUrlResolver,
	createSingleUrlResolver,
	resolveUrl,
} from "./utils";

describe("resolveUrl", () => {
	const baseUrl = "https://example.com";

	test("resolves relative path to absolute URL", () => {
		expect(resolveUrl("/path", baseUrl)).toBe("https://example.com/path");
	});

	test("resolves relative path without leading slash", () => {
		expect(resolveUrl("path", baseUrl)).toBe("https://example.com/path");
	});

	test("preserves absolute http URL", () => {
		expect(resolveUrl("http://other.com/path", baseUrl)).toBe(
			"http://other.com/path",
		);
	});

	test("preserves absolute https URL", () => {
		expect(resolveUrl("https://other.com/path", baseUrl)).toBe(
			"https://other.com/path",
		);
	});

	test("handles URL object as input", () => {
		expect(resolveUrl(new URL("/path", "https://localhost"), baseUrl)).toBe(
			"https://localhost/path",
		);
	});

	test("handles URL object as baseUrl", () => {
		expect(resolveUrl("/path", new URL("https://example.org"))).toBe(
			"https://example.org/path",
		);
	});
});

describe("createSingleUrlResolver", () => {
	const resolveManifest = createSingleUrlResolver("manifest");

	describe("without baseUrl", () => {
		test("returns value unchanged when baseUrl is not provided", () => {
			const result = resolveManifest({ manifest: "/manifest.json" });

			expect(result).toBe("/manifest.json");
		});

		test("returns value unchanged when baseUrl is null", () => {
			const result = resolveManifest({ manifest: "/manifest.json" }, null);

			expect(result).toBe("/manifest.json");
		});

		test("returns undefined when value is not provided", () => {
			const result = resolveManifest({});

			expect(result).toBeUndefined();
		});

		test("returns null when value is null", () => {
			const result = resolveManifest({ manifest: null });

			expect(result).toBeNull();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative path to absolute URL", () => {
			const result = resolveManifest({ manifest: "/manifest.json" }, baseUrl);

			expect(result).toBe("https://example.com/manifest.json");
		});

		test("resolves relative path without leading slash", () => {
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

		test("handles URL object as value", () => {
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

describe("createArrayUrlResolver", () => {
	const resolveArchives = createArrayUrlResolver("archives");

	describe("without baseUrl", () => {
		test("returns value unchanged when baseUrl is not provided", () => {
			const result = resolveArchives({ archives: "/archives" });

			expect(result).toBe("/archives");
		});

		test("returns value unchanged when baseUrl is null", () => {
			const result = resolveArchives({ archives: "/archives" }, null);

			expect(result).toBe("/archives");
		});

		test("returns undefined when value is not provided", () => {
			const result = resolveArchives({});

			expect(result).toBeUndefined();
		});

		test("returns null when value is null", () => {
			const result = resolveArchives({ archives: null });

			expect(result).toBeNull();
		});

		test("returns array unchanged when baseUrl is not provided", () => {
			const result = resolveArchives({
				archives: ["/archives/2023", "/archives/2024"],
			});

			expect(result).toEqual(["/archives/2023", "/archives/2024"]);
		});
	});

	describe("with baseUrl - single value", () => {
		const baseUrl = "https://example.com";

		test("resolves relative path to absolute URL", () => {
			const result = resolveArchives({ archives: "/archives" }, baseUrl);

			expect(result).toBe("https://example.com/archives");
		});

		test("resolves relative path without leading slash", () => {
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

	describe("with baseUrl - array value", () => {
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
	});
});
