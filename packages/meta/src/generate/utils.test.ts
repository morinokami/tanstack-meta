import { describe, expect, test } from "bun:test";

import { _meta, _multiMeta } from "./utils";

describe("_meta", () => {
	test("returns a meta object when content is provided", () => {
		expect(_meta({ name: "description", content: "Hello, world!" })).toEqual({
			name: "description",
			content: "Hello, world!",
		});
	});

	test("uses property when name is not provided", () => {
		expect(_meta({ property: "og:title", content: "My title" })).toEqual({
			property: "og:title",
			content: "My title",
		});
	});

	test("includes media attribute when provided", () => {
		expect(
			_meta({
				name: "theme-color",
				media: "(prefers-color-scheme: dark)",
				content: "#000000",
			}),
		).toEqual({
			name: "theme-color",
			media: "(prefers-color-scheme: dark)",
			content: "#000000",
		});
	});

	test("prefers name over property when both are provided", () => {
		expect(
			_meta({
				name: "description",
				property: "og:description",
				content: "Prefer name",
			}),
		).toEqual({
			name: "description",
			content: "Prefer name",
		});
	});

	test("stringifies non-string content", () => {
		expect(_meta({ name: "count", content: 42 })).toEqual({
			name: "count",
			content: "42",
		});

		const url = new URL("https://example.com");
		expect(_meta({ name: "homepage", content: url })).toEqual({
			name: "homepage",
			content: "https://example.com/",
		});
	});

	test("returns undefined for falsy content", () => {
		const falsyContents: Array<string | number | URL | null | undefined> = [
			null,
			undefined,
			"",
			0,
		];

		for (const content of falsyContents) {
			expect(_meta({ name: "description", content })).toBeUndefined();
		}
	});
});

describe("_multiMeta", () => {
	test("returns undefined when contents is nullish", () => {
		expect(_multiMeta({ propertyPrefix: "og:image", contents: undefined })).toBeUndefined();
		expect(_multiMeta({ propertyPrefix: "og:image", contents: null })).toBeUndefined();
	});

	test("creates meta entries for primitive contents with a property prefix", () => {
		expect(
			_multiMeta({
				propertyPrefix: "og:image",
				contents: [
					new URL("https://example.com/one.png"),
					"https://example.com/two.png",
					123,
				],
			}),
		).toEqual([
			{ property: "og:image", content: "https://example.com/one.png" },
			{ property: "og:image", content: "https://example.com/two.png" },
			{ property: "og:image", content: "123" },
		]);
	});

	test("creates structured meta entries with snake-cased keys and url alias", () => {
		expect(
			_multiMeta({
				propertyPrefix: "og:image",
				contents: [
					{
						url: "https://example.com/img.png",
						secureUrl: "https://secure.example.com/img.png",
						width: 1200,
					},
				],
			}),
		).toEqual([
			{ property: "og:image", content: "https://example.com/img.png" },
			{
				property: "og:image:secure_url",
				content: "https://secure.example.com/img.png",
			},
			{ property: "og:image:width", content: "1200" },
		]);
	});

	test("filters out falsy or undefined entries", () => {
		expect(
			_multiMeta({
				propertyPrefix: "og:image",
				contents: [
					"",
					0,
					{ url: undefined, width: 0, height: 400, alt: null },
				],
			}),
		).toEqual([
			{ property: "og:image:width", content: "0" },
			{ property: "og:image:height", content: "400" },
		]);
	});

	test("uses name prefix when property prefix is absent", () => {
		expect(
			_multiMeta({
				namePrefix: "twitter:image",
				contents: [
					"https://example.com/one.png",
					{
						url: "https://example.com/two.png",
						alt: "An image",
					},
				],
			}),
		).toEqual([
			{ name: "twitter:image", content: "https://example.com/one.png" },
			{ name: "twitter:image", content: "https://example.com/two.png" },
			{ name: "twitter:image:alt", content: "An image" },
		]);
	});
});
