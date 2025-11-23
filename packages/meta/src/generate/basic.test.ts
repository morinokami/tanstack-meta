import { describe, expect, test } from "bun:test";

import type { InputMetadata } from "../types/io";
import { generateBasic, generateVerification } from "./basic";

describe("generateBasic", () => {
	test("builds meta entries for provided metadata fields", () => {
		const metadata = {
			charSet: "utf-8",
			title: "My Title",
			description: "A description",
			applicationName: "MyApp",
			generator: "MetaGen",
			keywords: ["alpha", "beta"],
			referrer: "no-referrer",
			creator: "Author",
			publisher: "Publisher",
			robots: {
				index: false,
				follow: true,
				noarchive: true,
				googleBot: {
					index: true,
					follow: false,
					nosnippet: true,
				},
			},
			abstract: "An abstract",
			other: {
				custom: "value",
				multi: ["one", "two"],
			},
		} satisfies InputMetadata;

		expect(generateBasic(metadata)).toEqual([
			{ charSet: "utf-8" },
			{ title: "My Title" },
			{ name: "description", content: "A description" },
			{ name: "application-name", content: "MyApp" },
			{ name: "generator", content: "MetaGen" },
			{ name: "keywords", content: "alpha,beta" },
			{ name: "referrer", content: "no-referrer" },
			{ name: "creator", content: "Author" },
			{ name: "publisher", content: "Publisher" },
			{ name: "robots", content: "noindex, follow, noarchive" },
			{ name: "googlebot", content: "index, nofollow, nosnippet" },
			{ name: "abstract", content: "An abstract" },
			{ name: "custom", content: "value" },
			{ name: "multi", content: "one" },
			{ name: "multi", content: "two" },
		]);
	});

	test("filters out falsy fields and stringifies non-string metadata", () => {
		const metadata = {
			description: "",
			keywords: "solo",
			other: { numeric: 7, empty: "", zero: 0 },
		} satisfies InputMetadata;

		expect(generateBasic(metadata)).toEqual([
			{ name: "keywords", content: "solo" },
			{ name: "numeric", content: "7" },
		]);
	});

	test("does not emit keywords when provided an empty array", () => {
		const metadata: InputMetadata = {
			keywords: [],
		};

		expect(generateBasic(metadata)).toEqual([]);
	});

	test("renders only googlebot directives when robots object only sets googleBot", () => {
		const metadata: InputMetadata = {
			robots: {
				googleBot: {
					index: true,
					follow: false,
				},
			},
		};

		expect(generateBasic(metadata)).toEqual([
			{ name: "googlebot", content: "index, nofollow" },
		]);
	});
});

describe("generateVerification", () => {
	test("returns an empty array when verification is not provided", () => {
		expect(generateVerification({})).toEqual([]);
	});

	test("emits verification tags for known providers and custom entries", () => {
		const metadata: InputMetadata = {
			verification: {
				google: ["g1", "g2"],
				yahoo: "yahoo-key",
				yandex: ["y1"],
				me: "@me",
				other: {
					"custom-site": ["c1", "c2"],
					another: "one",
				},
			},
		};

		expect(generateVerification(metadata)).toEqual([
			{ name: "google-site-verification", content: "g1" },
			{ name: "google-site-verification", content: "g2" },
			{ name: "y_key", content: "yahoo-key" },
			{ name: "yandex-verification", content: "y1" },
			{ name: "me", content: "@me" },
			{ name: "custom-site", content: "c1" },
			{ name: "custom-site", content: "c2" },
			{ name: "another", content: "one" },
		]);
	});

	test("handles nullish verification fields gracefully", () => {
		const metadata: InputMetadata = {
			verification: {
				google: null,
				yahoo: undefined,
				yandex: [],
				me: "",
			},
		};

		expect(generateVerification(metadata)).toEqual([]);
	});

	test("handles mixed array and string values for custom entries", () => {
		const metadata: InputMetadata = {
			verification: {
				other: {
					"site-a": "single",
					"site-b": ["multi1", "multi2"],
				},
			},
		};

		expect(generateVerification(metadata)).toEqual([
			{ name: "site-a", content: "single" },
			{ name: "site-b", content: "multi1" },
			{ name: "site-b", content: "multi2" },
		]);
	});
});
