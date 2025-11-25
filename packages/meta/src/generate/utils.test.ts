import { describe, expect, test } from "bun:test";

import { createMetaList, createMetaTag, flattenMetaList } from "./utils";

describe("createMetaTag", () => {
	test("returns a meta object when content is provided", () => {
		expect(
			createMetaTag({ name: "description", content: "Hello, world!" }),
		).toEqual({
			name: "description",
			content: "Hello, world!",
		});
	});

	test("uses property when name is not provided", () => {
		expect(
			createMetaTag({ property: "og:title", content: "My title" }),
		).toEqual({
			property: "og:title",
			content: "My title",
		});
	});

	test("includes media attribute when provided", () => {
		expect(
			createMetaTag({
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
			createMetaTag({
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
		expect(createMetaTag({ name: "count", content: 42 })).toEqual({
			name: "count",
			content: "42",
		});

		const url = new URL("https://example.com");
		expect(createMetaTag({ name: "homepage", content: url })).toEqual({
			name: "homepage",
			content: "https://example.com/",
		});
	});

	test("returns undefined for falsy content", () => {
		const falsyContents: (string | number | URL | null | undefined)[] = [
			null,
			undefined,
			"",
			0,
		];

		for (const content of falsyContents) {
			expect(createMetaTag({ name: "description", content })).toBeUndefined();
		}
	});

	test("returns undefined when neither name nor property is provided", () => {
		expect(createMetaTag({ content: "value" })).toBeUndefined();
	});
});

describe("createMetaList", () => {
	test("returns undefined when contents is nullish", () => {
		expect(
			createMetaList({ propertyPrefix: "og:image", contents: undefined }),
		).toBeUndefined();
		expect(
			createMetaList({ propertyPrefix: "og:image", contents: null }),
		).toBeUndefined();
	});

	test("creates meta entries for primitive contents with a property prefix", () => {
		expect(
			createMetaList({
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
			createMetaList({
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
			createMetaList({
				propertyPrefix: "og:image",
				contents: [
					"",
					0,
					{ url: undefined, width: 800, height: 400, alt: null },
				],
			}),
		).toEqual([
			{ property: "og:image:width", content: "800" },
			{ property: "og:image:height", content: "400" },
		]);
	});

	test("uses name prefix when property prefix is absent", () => {
		expect(
			createMetaList({
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

describe("flattenMetaList", () => {
	test("flattens nested arrays and removes nullish items", () => {
		const first = { name: "one", content: "1" };
		const second = { name: "two", content: "2" };
		const third = { name: "three", content: "3" };

		expect(
			flattenMetaList([
				first,
				null,
				[second, undefined],
				third,
				[null, undefined],
			]),
		).toEqual([first, second, third]);
	});

	test("accepts readonly nested arrays", () => {
		const nested = [{ property: "og:title", content: "Title" }] as const;

		expect(flattenMetaList([nested])).toEqual([
			{ property: "og:title", content: "Title" },
		]);
	});
});
