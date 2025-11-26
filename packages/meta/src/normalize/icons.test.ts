import { describe, expect, test } from "bun:test";

import { normalizeIcon, normalizeIcons } from "./icons";

describe("normalizeIcon", () => {
	test("wraps string or URL in descriptor", () => {
		const result = normalizeIcon("/icon.png");

		expect(result).toEqual({ url: "/icon.png" });

		const result2 = normalizeIcon(new URL("https://example.com/icon.png"));

		expect(result2).toEqual({
			url: new URL("https://example.com/icon.png"),
		});
	});

	test("returns descriptor unchanged", () => {
		const descriptor = { url: "/icon.png", rel: "shortcut icon" };

		const result = normalizeIcon(descriptor);

		expect(result).toEqual(descriptor);
	});
});

describe("normalizeIcons", () => {
	test("returns null when icons is falsy", () => {
		const result = normalizeIcons(undefined);

		expect(result).toBeNull();
	});

	test("normalizes array input to icon list", () => {
		const result = normalizeIcons([
			"/a.png",
			{ url: "/b.png", sizes: "32x32" },
		]);

		expect(result).toEqual({
			icon: [{ url: "/a.png" }, { url: "/b.png", sizes: "32x32" }],
			apple: [],
		});
	});

	test("normalizes string input to icon array", () => {
		const result = normalizeIcons("/single.png");

		expect(result).toEqual({
			icon: [{ url: "/single.png" }],
			apple: [],
		});
	});

	test("normalizes URL instance input to icon array", () => {
		const url = new URL("https://example.com/icon.png");

		const result = normalizeIcons(url);

		expect(result).toEqual({
			icon: [{ url }],
			apple: [],
		});
	});

	test("normalizes icons object with multiple buckets", () => {
		const result = normalizeIcons({
			icon: ["/icon.png", { url: "/icon2.png", type: "image/png" }],
			shortcut: "/favicon.ico",
			apple: [{ url: "/apple.png", sizes: "180x180" }],
			other: { url: "/mask.svg", rel: "mask-icon", color: "#000" },
		});

		expect(result).toEqual({
			icon: [{ url: "/icon.png" }, { url: "/icon2.png", type: "image/png" }],
			apple: [{ url: "/apple.png", sizes: "180x180" }],
			shortcut: [{ url: "/favicon.ico" }],
			other: [{ url: "/mask.svg", rel: "mask-icon", color: "#000" }],
		});
	});

	test("omits buckets with undefined or empty values", () => {
		const result = normalizeIcons({
			icon: [],
			shortcut: undefined,
			apple: undefined,
		});

		expect(result).toEqual({
			icon: [],
			apple: [],
		});
	});

	test("filters out falsy values from icon array", () => {
		const result = normalizeIcons([
			"/icon.png",
			// biome-ignore lint/suspicious/noExplicitAny: reason
			null as any,
			// biome-ignore lint/suspicious/noExplicitAny: reason
			undefined as any,
			"/icon2.png",
		]);

		expect(result).toEqual({
			icon: [{ url: "/icon.png" }, { url: "/icon2.png" }],
			apple: [],
		});
	});
});
