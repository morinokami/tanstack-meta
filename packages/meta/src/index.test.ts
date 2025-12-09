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
	describe("without options", () => {
		test("passes through title unchanged", () => {
			const generateMetadata = createMetadataGenerator();
			const result = generateMetadata({ title: "My Page" });

			expect(result.meta).toContainEqual({ title: "My Page" });
		});

		test("handles null title", () => {
			const generateMetadata = createMetadataGenerator();
			const result = generateMetadata({ title: null });

			expect(result.meta).not.toContainEqual(
				expect.objectContaining({ title: expect.any(String) }),
			);
		});

		test("handles undefined title", () => {
			const generateMetadata = createMetadataGenerator();
			const result = generateMetadata({});

			expect(result.meta).not.toContainEqual(
				expect.objectContaining({ title: expect.any(String) }),
			);
		});
	});

	describe("with titleTemplate", () => {
		const generateMetadata = createMetadataGenerator({
			titleTemplate: { default: "My Site", template: "%s | My Site" },
		});

		test("applies template to string title", () => {
			const result = generateMetadata({ title: "About" });

			expect(result.meta).toContainEqual({ title: "About | My Site" });
		});

		test("uses default when title is null", () => {
			const result = generateMetadata({ title: null });

			expect(result.meta).toContainEqual({ title: "My Site | My Site" });
		});

		test("uses default when title is undefined", () => {
			const result = generateMetadata({});

			expect(result.meta).toContainEqual({ title: "My Site | My Site" });
		});

		test("ignores template when title is absolute", () => {
			const result = generateMetadata({ title: { absolute: "Home" } });

			expect(result.meta).toContainEqual({ title: "Home" });
		});

		test("handles absolute title with special characters", () => {
			const result = generateMetadata({
				title: { absolute: "Welcome | Special Page" },
			});

			expect(result.meta).toContainEqual({ title: "Welcome | Special Page" });
		});
	});

	describe("with other metadata fields", () => {
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
	});

	describe("template variations", () => {
		test("supports prefix template", () => {
			const generateMetadata = createMetadataGenerator({
				titleTemplate: { default: "Home", template: "Acme | %s" },
			});

			const result = generateMetadata({ title: "Products" });

			expect(result.meta).toContainEqual({ title: "Acme | Products" });
		});

		test("supports template without separator", () => {
			const generateMetadata = createMetadataGenerator({
				titleTemplate: { default: "Welcome", template: "%s" },
			});

			const result = generateMetadata({ title: "Hello" });

			expect(result.meta).toContainEqual({ title: "Hello" });
		});

		test("handles empty string title with template", () => {
			const generateMetadata = createMetadataGenerator({
				titleTemplate: { default: "Default", template: "%s | Site" },
			});

			const result = generateMetadata({ title: "" });

			expect(result.meta).toContainEqual({ title: " | Site" });
		});
	});
});
