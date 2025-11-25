import { describe, expect, test } from "bun:test";

import {
	normalizeAlternates,
	normalizeAppleWebApp,
	normalizeFacebook,
	normalizeItunes,
	normalizeRobotsValue,
	normalizeVerification,
} from "./basic";

describe("normalizeAlternates", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeAlternates(null);

		expect(result).toBeNull();
	});

	test("normalizes canonical, languages, media, and types entries", () => {
		const result = normalizeAlternates({
			canonical: "https://example.com",
			languages: {
				en: "https://example.com/en",
				fr: [{ url: "https://example.com/fr", title: "French" }],
			},
			media: {
				screen: [{ url: "/media.png", title: "Screen" }],
			},
			types: {
				application: [{ url: "/app", title: "App" }],
			},
		});

		expect(result).toEqual({
			canonical: { url: "https://example.com" },
			languages: {
				en: [{ url: "https://example.com/en" }],
				fr: [{ url: "https://example.com/fr", title: "French" }],
			},
			media: { screen: [{ url: "/media.png", title: "Screen" }] },
			types: { application: [{ url: "/app", title: "App" }] },
		});
	});

	test("handles URL instances and empty inputs", () => {
		const result = normalizeAlternates({
			canonical: new URL("https://example.com"),
			languages: {},
			media: { print: [] },
			types: undefined,
		});

		expect(result).toEqual({
			canonical: { url: new URL("https://example.com") },
			languages: {},
			media: {},
			types: null,
		});
	});
});

describe("normalizeAppleWebApp", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeAppleWebApp(undefined);

		expect(result).toBeNull();
	});

	test("returns capable only when appleWebApp is true", () => {
		const result = normalizeAppleWebApp(true);

		expect(result).toEqual({ capable: true });
	});

	test("respects explicit capable false and string startupImage", () => {
		const result = normalizeAppleWebApp({
			capable: false,
			startupImage: "/one.png",
		});

		expect(result).toEqual({
			capable: false,
			title: null,
			startupImage: [{ url: "/one.png" }],
			statusBarStyle: "default",
		});
	});

	test("normalizes apple web app object with defaults and startup images", () => {
		const result = normalizeAppleWebApp({
			title: "",
			startupImage: ["/img.png", { url: "/img2.png", media: "print" }],
			statusBarStyle: undefined,
		});

		expect(result).toEqual({
			capable: true,
			title: null,
			startupImage: [{ url: "/img.png" }, { url: "/img2.png", media: "print" }],
			statusBarStyle: "default",
		});
	});
});

describe("normalizeFacebook", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeFacebook(undefined);

		expect(result).toBeNull();
	});

	test("normalizes appId and admins to array", () => {
		const withAppId = normalizeFacebook({ appId: "123" });
		expect(withAppId).toEqual({
			appId: "123",
			admins: undefined,
		});

		const withAdmins = normalizeFacebook({ admins: "root" });
		expect(withAdmins).toEqual({
			appId: undefined,
			admins: ["root"],
		});
	});
});

describe("normalizeItunes", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeItunes(undefined);

		expect(result).toBeNull();
	});

	test("normalizes itunes fields and omits undefined appArgument", () => {
		const result = normalizeItunes({ appId: "abc", appArgument: "foo" });

		expect(result).toEqual({
			appId: "abc",
			appArgument: "foo",
		});
	});
});

describe("normalizeRobotsValue", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeRobotsValue(undefined);

		expect(result).toBeNull();
	});

	test("returns string unchanged", () => {
		const result = normalizeRobotsValue("index");

		expect(result).toBe("index");
	});

	test("builds robots string from object flags", () => {
		const result = normalizeRobotsValue({
			index: false,
			follow: true,
			noarchive: false,
			noimageindex: true,
			"max-snippet": 5,
		});

		expect(result).toBe("noindex, follow, noimageindex, max-snippet:5");
	});
});

describe("normalizeVerification", () => {
	test("returns null when input is falsy", () => {
		const result = normalizeVerification(undefined);

		expect(result).toBeNull();
	});

	test("normalizes string, array, and other verifications", () => {
		const result = normalizeVerification({
			google: "token",
			yahoo: ["y1", "y2"],
			me: 123,
			other: {
				foo: ["a"],
				bar: undefined as unknown as string[],
			},
		});

		expect(result).toEqual({
			google: ["token"],
			yahoo: ["y1", "y2"],
			me: [123],
			other: {
				foo: ["a"],
			},
		});
	});
});
