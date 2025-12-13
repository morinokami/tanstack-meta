import { describe, expect, test } from "bun:test";

import { resolveOpenGraph } from "./opengraph";

describe("resolveOpenGraph", () => {
	describe("without baseUrl", () => {
		test("returns openGraph unchanged when baseUrl is not provided", () => {
			const openGraph = { url: "/page" };
			const result = resolveOpenGraph({ openGraph });

			expect(result).toBe(openGraph);
		});

		test("returns openGraph unchanged when baseUrl is null", () => {
			const openGraph = { url: "/page" };
			const result = resolveOpenGraph({ openGraph }, null);

			expect(result).toBe(openGraph);
		});

		test("returns undefined when openGraph is not provided", () => {
			const result = resolveOpenGraph({});

			expect(result).toBeUndefined();
		});
	});

	describe("with baseUrl - url", () => {
		const baseUrl = "https://example.com";

		test("resolves relative url", () => {
			const result = resolveOpenGraph({ openGraph: { url: "/page" } }, baseUrl);

			expect(result).toEqual({ url: "https://example.com/page" });
		});

		test("preserves absolute url", () => {
			const result = resolveOpenGraph(
				{ openGraph: { url: "https://other.com/page" } },
				baseUrl,
			);

			expect(result).toEqual({ url: "https://other.com/page" });
		});
	});

	describe("with baseUrl - images", () => {
		const baseUrl = "https://example.com";

		test("resolves relative image string", () => {
			const result = resolveOpenGraph(
				{ openGraph: { images: "/og.png" } },
				baseUrl,
			);

			expect(result).toEqual({ images: "https://example.com/og.png" });
		});

		test("resolves array of image strings", () => {
			const result = resolveOpenGraph(
				{ openGraph: { images: ["/og1.png", "/og2.png"] } },
				baseUrl,
			);

			expect(result).toEqual({
				images: ["https://example.com/og1.png", "https://example.com/og2.png"],
			});
		});

		test("resolves image descriptor with url and secureUrl", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						images: {
							url: "/og.png",
							secureUrl: "/og-secure.png",
							alt: "OG Image",
							width: 1200,
							height: 630,
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
					width: 1200,
					height: 630,
				},
			});
		});

		test("resolves array of image descriptors", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
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
	});

	describe("with baseUrl - audio", () => {
		const baseUrl = "https://example.com";

		test("resolves audio string", () => {
			const result = resolveOpenGraph(
				{ openGraph: { audio: "/audio.mp3" } },
				baseUrl,
			);

			expect(result).toEqual({ audio: "https://example.com/audio.mp3" });
		});

		test("resolves audio descriptor", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						audio: { url: "/audio.mp3", type: "audio/mpeg" },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				audio: {
					url: "https://example.com/audio.mp3",
					type: "audio/mpeg",
				},
			});
		});

		test("resolves array of audio", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						audio: [
							{ url: "/audio1.mp3", type: "audio/mpeg" },
							{ url: "/audio2.mp3", type: "audio/mpeg" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				audio: [
					{ url: "https://example.com/audio1.mp3", type: "audio/mpeg" },
					{ url: "https://example.com/audio2.mp3", type: "audio/mpeg" },
				],
			});
		});
	});

	describe("with baseUrl - videos", () => {
		const baseUrl = "https://example.com";

		test("resolves video string", () => {
			const result = resolveOpenGraph(
				{ openGraph: { videos: "/video.mp4" } },
				baseUrl,
			);

			expect(result).toEqual({ videos: "https://example.com/video.mp4" });
		});

		test("resolves video descriptor with secureUrl", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						videos: {
							url: "/video.mp4",
							secureUrl: "/video-secure.mp4",
							width: 1920,
							height: 1080,
						},
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				videos: {
					url: "https://example.com/video.mp4",
					secureUrl: "https://example.com/video-secure.mp4",
					width: 1920,
					height: 1080,
				},
			});
		});

		test("resolves array of videos", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						videos: [
							{ url: "/video1.mp4", width: 1920, height: 1080 },
							{ url: "/video2.mp4", width: 1280, height: 720 },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				videos: [
					{ url: "https://example.com/video1.mp4", width: 1920, height: 1080 },
					{ url: "https://example.com/video2.mp4", width: 1280, height: 720 },
				],
			});
		});
	});

	describe("with baseUrl - article type", () => {
		const baseUrl = "https://example.com";

		test("resolves authors URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "article",
						authors: ["/author/john", "/author/jane"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "article",
				authors: [
					"https://example.com/author/john",
					"https://example.com/author/jane",
				],
			});
		});

		test("resolves single author URL", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "article",
						authors: "/author/john",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "article",
				authors: "https://example.com/author/john",
			});
		});
	});

	describe("with baseUrl - music.song type", () => {
		const baseUrl = "https://example.com";

		test("resolves musicians URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.song",
						musicians: ["/artist/1", "/artist/2"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.song",
				musicians: [
					"https://example.com/artist/1",
					"https://example.com/artist/2",
				],
			});
		});

		test("resolves albums with url descriptor", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.song",
						albums: { url: "/album/1", disc: 1, track: 5 },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.song",
				albums: { url: "https://example.com/album/1", disc: 1, track: 5 },
			});
		});
	});

	describe("with baseUrl - music.album type", () => {
		const baseUrl = "https://example.com";

		test("resolves songs URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.album",
						songs: ["/song/1", "/song/2"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.album",
				songs: ["https://example.com/song/1", "https://example.com/song/2"],
			});
		});

		test("resolves musicians URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.album",
						musicians: ["/artist/1", "/artist/2"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.album",
				musicians: [
					"https://example.com/artist/1",
					"https://example.com/artist/2",
				],
			});
		});
	});

	describe("with baseUrl - music.playlist type", () => {
		const baseUrl = "https://example.com";

		test("resolves creators URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.playlist",
						creators: "/creator/1",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.playlist",
				creators: "https://example.com/creator/1",
			});
		});

		test("resolves songs URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "music.playlist",
						songs: ["/song/1", "/song/2"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "music.playlist",
				songs: ["https://example.com/song/1", "https://example.com/song/2"],
			});
		});
	});

	describe("with baseUrl - video.movie type", () => {
		const baseUrl = "https://example.com";

		test("resolves actors with url descriptor", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "video.movie",
						actors: [
							{ url: "/actor/1", role: "Lead" },
							{ url: "/actor/2", role: "Supporting" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "video.movie",
				actors: [
					{ url: "https://example.com/actor/1", role: "Lead" },
					{ url: "https://example.com/actor/2", role: "Supporting" },
				],
			});
		});

		test("resolves directors URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "video.movie",
						directors: ["/director/1"],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "video.movie",
				directors: ["https://example.com/director/1"],
			});
		});

		test("resolves writers URLs", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "video.movie",
						writers: "/writer/1",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "video.movie",
				writers: "https://example.com/writer/1",
			});
		});
	});

	describe("with baseUrl - video.episode type", () => {
		const baseUrl = "https://example.com";

		test("resolves series URL", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "video.episode",
						series: "/series/1",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "video.episode",
				series: "https://example.com/series/1",
			});
		});
	});

	describe("with baseUrl - combined", () => {
		const baseUrl = "https://example.com";

		test("resolves all URL fields together", () => {
			const result = resolveOpenGraph(
				{
					openGraph: {
						type: "article",
						url: "/article/1",
						images: ["/og.png"],
						authors: ["/author/1"],
						title: "My Article",
						description: "Article description",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				type: "article",
				url: "https://example.com/article/1",
				images: ["https://example.com/og.png"],
				authors: ["https://example.com/author/1"],
				title: "My Article",
				description: "Article description",
			});
		});
	});
});
