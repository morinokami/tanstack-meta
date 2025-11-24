import { describe, expect, test } from "bun:test";

import { normalizeMetadata } from "../normalize";
import type { InputMetadata } from "../types/io";
import { generateAlternatesLinks } from "./alternates";

describe("generateAlternatesLinks", () => {
	test("returns empty when alternates is not provided", () => {
		expect(generateAlternatesLinks(normalizeMetadata({} as InputMetadata))).toEqual(
			[],
		);
	});

	test("emits canonical link when provided", () => {
		const metadata = normalizeMetadata({
			alternates: {
				canonical: "https://example.com",
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "canonical", href: "https://example.com" },
		]);
	});

	test("emits language alternates", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					en: [{ url: "https://example.com/en" }],
					es: [{ url: "https://example.com/es" }],
					fr: [{ url: "https://example.com/fr" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en" },
			{ rel: "alternate", hrefLang: "es", href: "https://example.com/es" },
			{ rel: "alternate", hrefLang: "fr", href: "https://example.com/fr" },
		]);
	});

	test("emits media alternates", () => {
		const metadata = normalizeMetadata({
			alternates: {
				media: {
					"(max-width: 600px)": [{ url: "https://m.example.com" }],
					"(min-width: 601px)": [{ url: "https://www.example.com" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{
				rel: "alternate",
				media: "(max-width: 600px)",
				href: "https://m.example.com",
			},
			{
				rel: "alternate",
				media: "(min-width: 601px)",
				href: "https://www.example.com",
			},
		]);
	});

	test("emits type alternates", () => {
		const metadata = normalizeMetadata({
			alternates: {
				types: {
					"application/rss+xml": [{ url: "https://example.com/feed.xml" }],
					"application/atom+xml": [{ url: "https://example.com/atom.xml" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{
				rel: "alternate",
				type: "application/rss+xml",
				href: "https://example.com/feed.xml",
			},
			{
				rel: "alternate",
				type: "application/atom+xml",
				href: "https://example.com/atom.xml",
			},
		]);
	});

	test("emits language, media, and type alternates with string and URL descriptors", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					en: [{ url: "https://example.com/en" }],
					ja: [{ url: new URL("https://example.com/ja"), title: "Japanese" }],
				},
				media: {
					"(max-width: 600px)": [{ url: "https://m.example.com" }],
				},
				types: {
					"application/rss+xml": [{ url: "https://example.com/rss.xml" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en" },
			{
				rel: "alternate",
				hrefLang: "ja",
				href: "https://example.com/ja",
				title: "Japanese",
			},
			{
				rel: "alternate",
				media: "(max-width: 600px)",
				href: "https://m.example.com",
			},
			{
				rel: "alternate",
				type: "application/rss+xml",
				href: "https://example.com/rss.xml",
			},
		]);
	});

	test("handles multiple descriptors per language", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					en: [
						{ url: "https://example.com/en" },
						{ url: "https://example.org/en", title: "Alternative EN" },
					],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en" },
			{
				rel: "alternate",
				hrefLang: "en",
				href: "https://example.org/en",
				title: "Alternative EN",
			},
		]);
	});

	test("handles empty descriptor arrays", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					en: [],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([]);
	});

	test("combines canonical with other alternates", () => {
		const metadata = normalizeMetadata({
			alternates: {
				canonical: "https://example.com",
				languages: {
					en: [{ url: "https://example.com/en" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "canonical", href: "https://example.com" },
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en" },
		]);
	});

	test("handles x-default language fallback", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					"x-default": [{ url: "https://example.com" }],
					en: [{ url: "https://example.com/en" }],
					ja: [{ url: "https://example.com/ja" }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "alternate", hrefLang: "x-default", href: "https://example.com" },
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en" },
			{ rel: "alternate", hrefLang: "ja", href: "https://example.com/ja" },
		]);
	});

	test("returns empty when all alternate types are empty objects", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {},
				media: {},
				types: {},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([]);
	});

	test("preserves URL format including trailing slashes", () => {
		const metadata = normalizeMetadata({
			alternates: {
				languages: {
					en: [{ url: new URL("https://example.com/en/") }],
				},
			},
		});

		expect(generateAlternatesLinks(metadata)).toEqual([
			{ rel: "alternate", hrefLang: "en", href: "https://example.com/en/" },
		]);
	});
});
