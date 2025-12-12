import { describe, expect, test } from "bun:test";

import { resolveAlternates } from "./alternates";

describe("resolveAlternates", () => {
	describe("without baseUrl", () => {
		test("returns alternates unchanged when baseUrl is not provided", () => {
			const alternates = { canonical: "/page" };
			const result = resolveAlternates({ alternates });

			expect(result).toBe(alternates);
		});

		test("returns alternates unchanged when baseUrl is null", () => {
			const alternates = { canonical: "/page" };
			const result = resolveAlternates({ alternates }, null);

			expect(result).toBe(alternates);
		});

		test("returns undefined when alternates is not provided", () => {
			const result = resolveAlternates({});

			expect(result).toBeUndefined();
		});
	});

	describe("with baseUrl - canonical", () => {
		const baseUrl = "https://example.com";

		test("works with URL object as baseUrl", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: "/page" } },
				new URL("https://example.com"),
			);

			expect(result).toEqual({ canonical: "https://example.com/page" });
		});

		test("handles empty string canonical as falsy value", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: "" } },
				baseUrl,
			);

			expect(result).toEqual({ canonical: "" });
		});

		test("resolves relative canonical string to absolute URL", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: "/page" } },
				baseUrl,
			);

			expect(result).toEqual({ canonical: "https://example.com/page" });
		});

		test("preserves absolute canonical URL unchanged", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: "https://other.com/page" } },
				baseUrl,
			);

			expect(result).toEqual({ canonical: "https://other.com/page" });
		});

		test("resolves canonical URL object", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: new URL("/page", "https://localhost") } },
				baseUrl,
			);

			expect(result).toEqual({ canonical: "https://localhost/page" });
		});

		test("resolves canonical AlternateLinkDescriptor", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: { url: "/page", title: "Page" } } },
				baseUrl,
			);

			expect(result).toEqual({
				canonical: { url: "https://example.com/page", title: "Page" },
			});
		});

		test("handles null canonical", () => {
			const result = resolveAlternates(
				{ alternates: { canonical: null } },
				baseUrl,
			);

			expect(result).toEqual({ canonical: null });
		});
	});

	describe("with baseUrl - languages", () => {
		const baseUrl = "https://example.com";

		test("resolves relative language URLs", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"en-US": "/en",
							"ja-JP": "/ja",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"en-US": "https://example.com/en",
					"ja-JP": "https://example.com/ja",
				},
			});
		});

		test("resolves language AlternateLinkDescriptor array", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"en-US": [
								{ url: "/en", title: "English" },
								{ url: "/en-alt", title: "English Alt" },
							],
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"en-US": [
						{ url: "https://example.com/en", title: "English" },
						{ url: "https://example.com/en-alt", title: "English Alt" },
					],
				},
			});
		});

		test("handles null language value", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"en-US": null,
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"en-US": null,
				},
			});
		});

		test("handles x-default language", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"x-default": "/",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"x-default": "https://example.com/",
				},
			});
		});

		test("filters out undefined values in languages", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"en-US": "/en",
							"ja-JP": undefined,
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"en-US": "https://example.com/en",
				},
			});
		});

		test("handles empty languages object", () => {
			const result = resolveAlternates(
				{ alternates: { languages: {} } },
				baseUrl,
			);

			expect(result).toEqual({ languages: {} });
		});

		test("preserves absolute URL in languages unchanged", () => {
			const result = resolveAlternates(
				{
					alternates: {
						languages: {
							"en-US": "https://other.com/en",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				languages: {
					"en-US": "https://other.com/en",
				},
			});
		});
	});

	describe("with baseUrl - media", () => {
		const baseUrl = "https://example.com";

		test("resolves relative media URLs", () => {
			const result = resolveAlternates(
				{
					alternates: {
						media: {
							"only screen and (max-width: 600px)": "/mobile",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				media: {
					"only screen and (max-width: 600px)": "https://example.com/mobile",
				},
			});
		});

		test("resolves media AlternateLinkDescriptor array", () => {
			const result = resolveAlternates(
				{
					alternates: {
						media: {
							print: [{ url: "/print", title: "Print Version" }],
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				media: {
					print: [{ url: "https://example.com/print", title: "Print Version" }],
				},
			});
		});

		test("preserves absolute URL in media unchanged", () => {
			const result = resolveAlternates(
				{
					alternates: {
						media: {
							print: "https://other.com/print",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				media: {
					print: "https://other.com/print",
				},
			});
		});
	});

	describe("with baseUrl - types", () => {
		const baseUrl = "https://example.com";

		test("resolves relative type URLs", () => {
			const result = resolveAlternates(
				{
					alternates: {
						types: {
							"application/rss+xml": "/feed.xml",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				types: {
					"application/rss+xml": "https://example.com/feed.xml",
				},
			});
		});

		test("resolves type AlternateLinkDescriptor array", () => {
			const result = resolveAlternates(
				{
					alternates: {
						types: {
							"application/atom+xml": [
								{ url: "/atom.xml", title: "Atom Feed" },
							],
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				types: {
					"application/atom+xml": [
						{ url: "https://example.com/atom.xml", title: "Atom Feed" },
					],
				},
			});
		});

		test("preserves absolute URL in types unchanged", () => {
			const result = resolveAlternates(
				{
					alternates: {
						types: {
							"application/rss+xml": "https://other.com/feed.xml",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				types: {
					"application/rss+xml": "https://other.com/feed.xml",
				},
			});
		});
	});

	describe("with baseUrl - combined", () => {
		const baseUrl = "https://example.com";

		test("resolves all alternate fields together", () => {
			const result = resolveAlternates(
				{
					alternates: {
						canonical: "/page",
						languages: {
							"en-US": "/en/page",
							"ja-JP": "/ja/page",
						},
						media: {
							print: "/page/print",
						},
						types: {
							"application/rss+xml": "/page/feed.xml",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				canonical: "https://example.com/page",
				languages: {
					"en-US": "https://example.com/en/page",
					"ja-JP": "https://example.com/ja/page",
				},
				media: {
					print: "https://example.com/page/print",
				},
				types: {
					"application/rss+xml": "https://example.com/page/feed.xml",
				},
			});
		});
	});
});
