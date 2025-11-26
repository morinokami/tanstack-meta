import { describe, expect, test } from "bun:test";

import {
	normalizeAppLink,
	normalizeOpenGraph,
	normalizeTwitter,
} from "./opengraph";

describe("normalizeAppLink", () => {
	test("returns null when input is falsy", () => {
		expect(normalizeAppLink(undefined)).toBeNull();
	});

	test("normalizes platform entries and drops empty ones", () => {
		const result = normalizeAppLink({
			ios: { url: "https://example.com/ios", app_store_id: "1" },
		});

		expect(result).toEqual({
			ios: [{ url: "https://example.com/ios", app_store_id: "1" }],
		});
	});

	test("normalizes web and windows_phone platforms", () => {
		const result = normalizeAppLink({
			web: { url: "https://example.com/web", should_fallback: true },
			windows_phone: [{ url: "ms-app://example", app_id: "xyz" }],
		});

		expect(result).toEqual({
			web: [{ url: "https://example.com/web", should_fallback: true }],
			windows_phone: [{ url: "ms-app://example", app_id: "xyz" }],
		});
	});

	test("returns empty object when all platforms are undefined or null", () => {
		const result = normalizeAppLink({
			ios: undefined,
			android: undefined,
			web: undefined,
		});

		expect(result).toEqual({});
	});
});

describe("normalizeOpenGraph", () => {
	test("returns null when input is falsy", () => {
		expect(normalizeOpenGraph(undefined)).toBeNull();
	});

	test("normalizes array fields and resolves images", () => {
		const result = normalizeOpenGraph({
			title: "Title",
			description: "Desc",
			type: "article",
			authors: "author1",
			tags: ["tag1"],
			emails: "mail@example.com",
			images: ["https://example.com/img.png"],
		});

		expect(result).toMatchObject({
			title: "Title",
			type: "article",
			authors: ["author1"],
			tags: ["tag1"],
			emails: ["mail@example.com"],
			images: [{ url: "https://example.com/img.png" }],
		});
	});

	test("includes type-specific fields based on og type", () => {
		const article = normalizeOpenGraph({
			type: "article",
			authors: ["Author1"],
			tags: ["tag1"],
		});
		expect(article).toMatchObject({
			authors: ["Author1"],
			tags: ["tag1"],
		});

		const video = normalizeOpenGraph({
			type: "video.movie",
			actors: "Actor1",
			directors: ["Director1"],
		});
		expect(video).toMatchObject({
			actors: ["Actor1"],
			directors: ["Director1"],
		});
	});

	test("resolves and validates images with secureUrl", () => {
		const result = normalizeOpenGraph({
			images: [
				{
					url: "https://example.com/img.png",
					secureUrl: "https://secure.example.com/img.png",
				},
				{ url: "", secureUrl: "https://secure-only.com/img.png" },
				{ url: "invalid-url" },
				new URL("https://example.com/url-instance.png"),
			],
		});

		expect(result?.images).toEqual([
			{
				url: "https://example.com/img.png",
				secureUrl: "https://secure.example.com/img.png",
			},
			{ url: "", secureUrl: "https://secure-only.com/img.png" },
			{ url: "https://example.com/url-instance.png" },
		]);
	});

	test("handles explicit null values in fields", () => {
		const result = normalizeOpenGraph({
			type: "article",
			authors: null,
			tags: ["tag1"],
		});

		expect(result).toMatchObject({
			type: "article",
			authors: null,
			tags: ["tag1"],
		});
	});
});

describe("normalizeTwitter", () => {
	test("returns null when input is falsy", () => {
		expect(normalizeTwitter(undefined)).toBeNull();
	});

	test("defaults card to summary_large_image when images exist", () => {
		const result = normalizeTwitter({
			title: "T",
			description: "D",
			images: ["https://example.com/t.png"],
		});

		expect(result).toEqual({
			title: "T",
			description: "D",
			images: [{ url: "https://example.com/t.png" }],
			card: "summary_large_image",
			site: null,
			siteId: null,
			creator: null,
			creatorId: null,
		});
	});

	test("defaults card to summary when no images", () => {
		const result = normalizeTwitter({
			title: "Title",
			description: "Desc",
		});

		expect(result?.card).toBe("summary");
	});

	test("normalizes app card with app field", () => {
		const result = normalizeTwitter({
			card: "app",
			title: "App",
			app: {
				id: { iphone: "123", ipad: "456" },
			},
		});

		expect(result).toMatchObject({
			card: "app",
			title: "App",
			app: {
				id: { iphone: "123", ipad: "456" },
			},
		});
	});

	test("normalizes basic info keys", () => {
		const result = normalizeTwitter({
			title: "T",
			description: "D",
			site: "@site",
			siteId: "1",
			creator: "@creator",
			creatorId: "2",
		});

		expect(result).toMatchObject({
			title: "T",
			description: "D",
			site: "@site",
			siteId: "1",
			creator: "@creator",
			creatorId: "2",
		});
	});

	test("normalizes player card players array", () => {
		const result = normalizeTwitter({
			card: "player",
			title: "Player",
			players: {
				playerUrl: new URL("https://example.com/p"),
				streamUrl: new URL("https://example.com/s"),
				width: 640,
				height: 360,
			},
		});

		expect(result).toMatchObject({
			players: [
				{
					playerUrl: new URL("https://example.com/p"),
					streamUrl: new URL("https://example.com/s"),
					width: 640,
					height: 360,
				},
			],
		});
	});
});
