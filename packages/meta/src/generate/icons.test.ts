import { describe, expect, test } from "bun:test";

import type { InputMetadata } from "../types/io";
import { generateIcons } from "./icons";

describe("generateIcons", () => {
	test("returns an empty array when icons is not provided", () => {
		expect(generateIcons({})).toEqual([]);
	});

	test("returns an empty array when icons object only has empty arrays", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: [],
				shortcut: [],
				apple: [],
				other: [],
			},
		};

		expect(generateIcons(metadata)).toEqual([]);
	});

	test("emits icon links with default rel", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: ["/icon.png", { url: "/icon-192.png", sizes: "192x192" }],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "icon", href: "/icon.png" },
			{ rel: "icon", href: "/icon-192.png", sizes: "192x192" },
		]);
	});

	test("emits shortcut icon links", () => {
		const metadata: InputMetadata = {
			icons: {
				shortcut: ["/favicon.ico"],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "shortcut icon", href: "/favicon.ico" },
		]);
	});

	test("emits apple-touch-icon links", () => {
		const metadata: InputMetadata = {
			icons: {
				apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "apple-touch-icon", href: "/apple-icon.png", sizes: "180x180" },
		]);
	});

	test("emits icon, shortcut, apple, and other descriptors", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: [
					"/icon.png",
					{ url: "/icon-32.png", sizes: "32x32", type: "image/png" },
				],
				shortcut: [{ url: "/favicon.ico" }],
				apple: [
					{ url: "/apple-touch-icon.png", sizes: "180x180" },
					"https://cdn.com/apple-2.png",
				],
				other: [
					{
						url: "/mask-icon.svg",
						rel: "mask-icon",
						color: "#000",
					},
				],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{ rel: "icon", href: "/icon.png" },
			{ rel: "icon", href: "/icon-32.png", sizes: "32x32", type: "image/png" },
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "apple-touch-icon", href: "https://cdn.com/apple-2.png" },
			{ rel: "mask-icon", href: "/mask-icon.svg", color: "#000" },
		]);
	});

	test("uses provided rel on descriptors and stringifies URL objects", () => {
		const metadata: InputMetadata = {
			icons: {
				other: [
					{
						url: new URL("https://example.com/icon.svg"),
						rel: "preload",
						type: "image/svg+xml",
					},
				],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{
				rel: "preload",
				href: "https://example.com/icon.svg",
				type: "image/svg+xml",
			},
		]);
	});

	test("does not override explicit rel on icon descriptors", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: [{ url: "/icon.png", rel: "alternate icon" }],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "alternate icon", href: "/icon.png" },
		]);
	});

	test("uses default rel='icon' for other descriptors without rel", () => {
		const metadata: InputMetadata = {
			icons: {
				other: [{ url: "/custom.png" }],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "icon", href: "/custom.png" },
		]);
	});

	test("handles URL objects across icon types", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: [new URL("https://example.com/icon.png")],
				shortcut: [new URL("https://example.com/favicon.ico")],
				apple: [new URL("https://example.com/apple.png")],
				other: [{ url: new URL("https://example.com/other.png") }],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "shortcut icon", href: "https://example.com/favicon.ico" },
			{ rel: "icon", href: "https://example.com/icon.png" },
			{ rel: "apple-touch-icon", href: "https://example.com/apple.png" },
			{ rel: "icon", href: "https://example.com/other.png" },
		]);
	});

	test("handles partial icon lists with empty arrays", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: ["/icon.png"],
				shortcut: [],
				apple: [],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{ rel: "icon", href: "/icon.png" },
		]);
	});

	test("preserves media attribute for icons", () => {
		const metadata: InputMetadata = {
			icons: {
				icon: [
					{ url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
					{ url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
				],
			},
		};

		expect(generateIcons(metadata)).toEqual([
			{
				rel: "icon",
				href: "/icon-light.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				rel: "icon",
				href: "/icon-dark.png",
				media: "(prefers-color-scheme: dark)",
			},
		]);
	});
});
