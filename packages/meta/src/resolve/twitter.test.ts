import { describe, expect, test } from "bun:test";

import { resolveTwitter } from "./twitter";

describe("resolveTwitter", () => {
	describe("without baseUrl", () => {
		test("returns twitter unchanged when baseUrl is not provided", () => {
			const twitter = { images: "/og.png" };
			const result = resolveTwitter({ twitter });

			expect(result).toBe(twitter);
		});

		test("returns twitter unchanged when baseUrl is null", () => {
			const twitter = { images: "/og.png" };
			const result = resolveTwitter({ twitter }, null);

			expect(result).toBe(twitter);
		});

		test("returns undefined when twitter is not provided", () => {
			const result = resolveTwitter({});

			expect(result).toBeUndefined();
		});
	});

	describe("with baseUrl - images", () => {
		const baseUrl = "https://example.com";

		test("resolves relative image string", () => {
			const result = resolveTwitter(
				{ twitter: { images: "/og.png" } },
				baseUrl,
			);

			expect(result).toEqual({ images: "https://example.com/og.png" });
		});

		test("resolves array of image strings", () => {
			const result = resolveTwitter(
				{ twitter: { images: ["/og1.png", "/og2.png"] } },
				baseUrl,
			);

			expect(result).toEqual({
				images: ["https://example.com/og1.png", "https://example.com/og2.png"],
			});
		});

		test("resolves image descriptor with url and secureUrl", () => {
			const result = resolveTwitter(
				{
					twitter: {
						images: {
							url: "/og.png",
							secureUrl: "/og-secure.png",
							alt: "OG Image",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				images: {
					url: "https://example.com/og.png",
					secureUrl: "https://example.com/og-secure.png",
					alt: "OG Image",
				},
			});
		});

		test("resolves array of image descriptors", () => {
			const result = resolveTwitter(
				{
					twitter: {
						images: [
							{ url: "/og1.png", alt: "Image 1" },
							{ url: "/og2.png", alt: "Image 2" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				images: [
					{ url: "https://example.com/og1.png", alt: "Image 1" },
					{ url: "https://example.com/og2.png", alt: "Image 2" },
				],
			});
		});

		test("preserves absolute URLs", () => {
			const result = resolveTwitter(
				{ twitter: { images: "https://cdn.example.com/og.png" } },
				baseUrl,
			);

			expect(result).toEqual({ images: "https://cdn.example.com/og.png" });
		});
	});

	describe("with baseUrl - player card", () => {
		const baseUrl = "https://example.com";

		test("resolves single player URLs", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "player",
						players: {
							playerUrl: "/player",
							streamUrl: "/stream.mp4",
							width: 1280,
							height: 720,
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "player",
				players: {
					playerUrl: "https://example.com/player",
					streamUrl: "https://example.com/stream.mp4",
					width: 1280,
					height: 720,
				},
			});
		});

		test("resolves array of players", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "player",
						players: [
							{
								playerUrl: "/player1",
								streamUrl: "/stream1.mp4",
								width: 1280,
								height: 720,
							},
							{
								playerUrl: "/player2",
								streamUrl: "/stream2.mp4",
								width: 1920,
								height: 1080,
							},
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "player",
				players: [
					{
						playerUrl: "https://example.com/player1",
						streamUrl: "https://example.com/stream1.mp4",
						width: 1280,
						height: 720,
					},
					{
						playerUrl: "https://example.com/player2",
						streamUrl: "https://example.com/stream2.mp4",
						width: 1920,
						height: 1080,
					},
				],
			});
		});

		test("preserves absolute player URLs", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "player",
						players: {
							playerUrl: "https://player.example.com/embed",
							streamUrl: "https://cdn.example.com/stream.mp4",
							width: 1280,
							height: 720,
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "player",
				players: {
					playerUrl: "https://player.example.com/embed",
					streamUrl: "https://cdn.example.com/stream.mp4",
					width: 1280,
					height: 720,
				},
			});
		});
	});

	describe("with baseUrl - app card", () => {
		const baseUrl = "https://example.com";

		test("resolves app URLs for all platforms", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "app",
						app: {
							id: {
								iphone: "123456789",
								ipad: "987654321",
								googleplay: "com.example.app",
							},
							url: {
								iphone: "/app/iphone",
								ipad: "/app/ipad",
								googleplay: "/app/android",
							},
							name: "My App",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "app",
				app: {
					id: {
						iphone: "123456789",
						ipad: "987654321",
						googleplay: "com.example.app",
					},
					url: {
						iphone: "https://example.com/app/iphone",
						ipad: "https://example.com/app/ipad",
						googleplay: "https://example.com/app/android",
					},
					name: "My App",
				},
			});
		});

		test("resolves partial app URLs", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "app",
						app: {
							id: { iphone: "123456789" },
							url: { iphone: "/app/iphone" },
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "app",
				app: {
					id: { iphone: "123456789" },
					url: { iphone: "https://example.com/app/iphone" },
				},
			});
		});

		test("preserves app without url field", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "app",
						app: {
							id: { iphone: "123456789" },
							name: "My App",
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "app",
				app: {
					id: { iphone: "123456789" },
					name: "My App",
				},
			});
		});
	});

	describe("with baseUrl - combined", () => {
		const baseUrl = "https://example.com";

		test("resolves images with other metadata", () => {
			const result = resolveTwitter(
				{
					twitter: {
						card: "summary_large_image",
						site: "@example",
						creator: "@creator",
						title: "My Page",
						description: "Page description",
						images: "/og.png",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				card: "summary_large_image",
				site: "@example",
				creator: "@creator",
				title: "My Page",
				description: "Page description",
				images: "https://example.com/og.png",
			});
		});
	});
});
