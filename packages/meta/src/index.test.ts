import { describe, expect, test } from "bun:test";

import { createMetadataGenerator, generateMetadata } from "./index";

describe("generateMetadata", () => {
	test("returns meta and links for basic metadata", () => {
		const result = generateMetadata({
			title: "My Page",
			description: "A description",
		});

		expect(result.meta).toContainEqual({ title: "My Page" });
		expect(result.meta).toContainEqual({
			name: "description",
			content: "A description",
		});
		expect(result.links).toEqual([]);
	});

	test("returns empty arrays for empty metadata", () => {
		const result = generateMetadata({});

		expect(result.meta).toEqual([]);
		expect(result.links).toEqual([]);
	});
});

describe("createMetadataGenerator", () => {
	test("preserves other metadata when applying title template", () => {
		const generateMetadata = createMetadataGenerator({
			titleTemplate: { default: "Site", template: "%s - Site" },
		});

		const result = generateMetadata({
			title: "Blog",
			description: "My blog description",
			keywords: ["blog", "posts"],
		});

		expect(result.meta).toContainEqual({ title: "Blog - Site" });
		expect(result.meta).toContainEqual({
			name: "description",
			content: "My blog description",
		});
		expect(result.meta).toContainEqual({
			name: "keywords",
			content: "blog,posts",
		});
	});

	test("combines titleTemplate and baseUrl options", () => {
		const generateMetadata = createMetadataGenerator({
			titleTemplate: { default: "Site", template: "%s | Site" },
			baseUrl: "https://example.com",
		});

		const result = generateMetadata({
			title: "About",
			icons: "/favicon.ico",
		});

		expect(result.meta).toContainEqual({ title: "About | Site" });
		expect(result.links).toContainEqual({
			rel: "icon",
			href: "https://example.com/favicon.ico",
		});
	});
});
