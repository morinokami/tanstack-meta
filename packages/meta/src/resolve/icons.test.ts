import { describe, expect, test } from "bun:test";

import { resolveIcons } from "./icons";

describe("resolveIcons", () => {
	describe("without baseUrl", () => {
		test("returns icons unchanged when baseUrl is not provided", () => {
			const result = resolveIcons({ icons: "/favicon.ico" });

			expect(result).toBe("/favicon.ico");
		});

		test("returns icons unchanged when baseUrl is null", () => {
			const result = resolveIcons({ icons: "/favicon.ico" }, null);

			expect(result).toBe("/favicon.ico");
		});

		test("returns undefined when icons is not provided", () => {
			const result = resolveIcons({});

			expect(result).toBeUndefined();
		});
	});

	describe("with baseUrl", () => {
		const baseUrl = "https://example.com";

		test("resolves relative icon path to absolute URL", () => {
			const result = resolveIcons({ icons: "/favicon.ico" }, baseUrl);

			expect(result).toBe("https://example.com/favicon.ico");
		});

		test("resolves relative icon path without leading slash", () => {
			const result = resolveIcons({ icons: "favicon.ico" }, baseUrl);

			expect(result).toBe("https://example.com/favicon.ico");
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveIcons(
				{ icons: "https://cdn.example.com/icon.png" },
				baseUrl,
			);

			expect(result).toBe("https://cdn.example.com/icon.png");
		});

		test("resolves icons in array format", () => {
			const result = resolveIcons(
				{ icons: ["/icon-16.png", "/icon-32.png"] },
				baseUrl,
			);

			expect(result).toEqual([
				"https://example.com/icon-16.png",
				"https://example.com/icon-32.png",
			]);
		});

		test("resolves icons in object format", () => {
			const result = resolveIcons(
				{
					icons: {
						icon: "/favicon.ico",
						apple: "/apple-icon.png",
						shortcut: "/shortcut.ico",
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				icon: "https://example.com/favicon.ico",
				apple: "https://example.com/apple-icon.png",
				shortcut: "https://example.com/shortcut.ico",
			});
		});

		test("resolves icons in descriptor format", () => {
			const result = resolveIcons(
				{
					icons: {
						icon: { url: "/icon.png", sizes: "32x32", type: "image/png" },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				icon: {
					url: "https://example.com/icon.png",
					sizes: "32x32",
					type: "image/png",
				},
			});
		});

		test("resolves other icons with descriptor format", () => {
			const result = resolveIcons(
				{
					icons: {
						other: { url: "/mask-icon.svg", rel: "mask-icon", color: "#000" },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				other: {
					url: "https://example.com/mask-icon.svg",
					rel: "mask-icon",
					color: "#000",
				},
			});
		});

		test("handles URL object as baseUrl", () => {
			const result = resolveIcons(
				{ icons: "/icon.png" },
				new URL("https://example.org"),
			);

			expect(result).toBe("https://example.org/icon.png");
		});

		test("resolves array of icon descriptors", () => {
			const result = resolveIcons(
				{
					icons: {
						icon: [
							{ url: "/icon-16.png", sizes: "16x16" },
							{ url: "/icon-32.png", sizes: "32x32" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				icon: [
					{ url: "https://example.com/icon-16.png", sizes: "16x16" },
					{ url: "https://example.com/icon-32.png", sizes: "32x32" },
				],
			});
		});

		test("resolves array of other icon descriptors", () => {
			const result = resolveIcons(
				{
					icons: {
						other: [
							{ url: "/mask-icon.svg", rel: "mask-icon" },
							{ url: "/manifest.json", rel: "manifest" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				other: [
					{ url: "https://example.com/mask-icon.svg", rel: "mask-icon" },
					{ url: "https://example.com/manifest.json", rel: "manifest" },
				],
			});
		});
	});
});
