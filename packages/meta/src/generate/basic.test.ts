import { describe, expect, test } from "bun:test";

import { normalizeMetadata } from "../normalize";
import {
	generateAppleWebAppLinks,
	generateAppleWebAppMeta,
	generateBasicLinks,
	generateBasicMeta,
	generateFacebook,
	generateFormatDetection,
	generateItunes,
	generatePinterest,
	generateVerification,
} from "./basic";

describe("generateBasic", () => {
	test("builds meta entries for provided metadata fields", () => {
		const metadata = normalizeMetadata({
			charSet: "utf-8",
			title: "My Title",
			description: "A description",
			applicationName: "MyApp",
			authors: [
				{ name: "Author One", url: "https://example.com/one" },
				{ name: "Author Two" },
			],
			generator: "MetaGen",
			keywords: ["alpha", "beta"],
			referrer: "no-referrer",
			creator: "Author",
			publisher: "Publisher",
			robots: {
				index: false,
				follow: true,
				noarchive: true,
				googleBot: {
					index: true,
					follow: false,
					nosnippet: true,
				},
			},
			abstract: "An abstract",
			other: {
				custom: "value",
				multi: ["one", "two"],
			},
		});

		expect(generateBasicMeta(metadata)).toEqual([
			{ charSet: "utf-8" },
			{ title: "My Title" },
			{ name: "description", content: "A description" },
			{ name: "application-name", content: "MyApp" },
			{ name: "author", content: "Author One" },
			{ name: "author", content: "Author Two" },
			{ name: "generator", content: "MetaGen" },
			{ name: "keywords", content: "alpha,beta" },
			{ name: "referrer", content: "no-referrer" },
			{ name: "creator", content: "Author" },
			{ name: "publisher", content: "Publisher" },
			{ name: "robots", content: "noindex, follow, noarchive" },
			{ name: "googlebot", content: "index, nofollow, nosnippet" },
			{ name: "abstract", content: "An abstract" },
			{ name: "custom", content: "value" },
			{ name: "multi", content: "one" },
			{ name: "multi", content: "two" },
		]);
	});

	test("filters out falsy fields and stringifies non-string metadata", () => {
		const metadata = normalizeMetadata({
			description: "",
			keywords: "solo",
			other: { numeric: 7, empty: "", zero: 0 },
		});

		expect(generateBasicMeta(metadata)).toEqual([
			{ name: "keywords", content: "solo" },
			{ name: "numeric", content: "7" },
		]);
	});

	test("does not emit keywords when provided an empty array", () => {
		const metadata = normalizeMetadata({
			keywords: [],
		});

		expect(generateBasicMeta(metadata)).toEqual([]);
	});

	test("emits category and classification when provided", () => {
		const metadata = normalizeMetadata({
			category: "technology",
			classification: "business",
		});

		expect(generateBasicMeta(metadata)).toEqual([
			{ name: "category", content: "technology" },
			{ name: "classification", content: "business" },
		]);
	});

	test("renders only googlebot directives when robots object only sets googleBot", () => {
		const metadata = normalizeMetadata({
			robots: {
				googleBot: {
					index: true,
					follow: false,
				},
			},
		});

		expect(generateBasicMeta(metadata)).toEqual([
			{ name: "googlebot", content: "index, nofollow" },
		]);
	});
});

describe("generateBasicLinks", () => {
	test("returns no links when manifest is not provided", () => {
		expect(generateBasicLinks(normalizeMetadata({}))).toEqual([]);
	});

	test("emits author links when provided", () => {
		const metadata = normalizeMetadata({
			authors: [
				{ url: "https://example.com/one" },
				{ url: "https://example.com/two" },
			],
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "author", href: "https://example.com/one" },
			{ rel: "author", href: "https://example.com/two" },
		]);
	});

	test("emits a manifest link when provided as a string", () => {
		const metadata = normalizeMetadata({
			manifest: "/site.webmanifest",
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "manifest", href: "/site.webmanifest" },
		]);
	});

	test("stringifies manifest URL objects", () => {
		const metadata = normalizeMetadata({
			manifest: new URL("https://example.com/app.webmanifest"),
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "manifest", href: "https://example.com/app.webmanifest" },
		]);
	});

	test("emits archives links when provided", () => {
		const metadata = normalizeMetadata({
			archives: [
				"https://example.com/archive1",
				"https://example.com/archive2",
			],
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "archives", href: "https://example.com/archive1" },
			{ rel: "archives", href: "https://example.com/archive2" },
		]);
	});

	test("emits assets links when provided", () => {
		const metadata = normalizeMetadata({
			assets: [
				"https://example.com/assets.css",
				"https://example.com/assets.js",
			],
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "assets", href: "https://example.com/assets.css" },
			{ rel: "assets", href: "https://example.com/assets.js" },
		]);
	});

	test("emits bookmarks links when provided", () => {
		const metadata = normalizeMetadata({
			bookmarks: [
				"https://example.com/bookmark1",
				"https://example.com/bookmark2",
			],
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "bookmarks", href: "https://example.com/bookmark1" },
			{ rel: "bookmarks", href: "https://example.com/bookmark2" },
		]);
	});

	test("emits pagination links when previous and next are provided", () => {
		const metadata = normalizeMetadata({
			pagination: {
				previous: "https://example.com/page/1",
				next: "https://example.com/page/3",
			},
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "previous", href: "https://example.com/page/1" },
			{ rel: "next", href: "https://example.com/page/3" },
		]);
	});

	test("omits missing pagination entries and stringifies URLs", () => {
		const metadata = normalizeMetadata({
			pagination: {
				previous: new URL("https://example.com/page/2"),
				next: null,
			},
		});

		expect(generateBasicLinks(metadata)).toEqual([
			{ rel: "previous", href: "https://example.com/page/2" },
		]);
	});
});

describe("generateItunes", () => {
	test("returns an empty array when itunes is not provided", () => {
		expect(generateItunes(normalizeMetadata({}))).toEqual([]);
	});

	test("emits app id and optional argument", () => {
		const metadata = normalizeMetadata({
			itunes: {
				appId: "123456789",
				appArgument: "myapp://open",
			},
		});

		expect(generateItunes(metadata)).toEqual([
			{
				name: "apple-itunes-app",
				content: "app-id=123456789, app-argument=myapp://open",
			},
		]);
	});

	test("emits only app id when argument is not provided", () => {
		const metadata = normalizeMetadata({
			itunes: {
				appId: "123456789",
			},
		});

		expect(generateItunes(metadata)).toEqual([
			{
				name: "apple-itunes-app",
				content: "app-id=123456789",
			},
		]);
	});

	test("omits app-argument when empty string", () => {
		const metadata = normalizeMetadata({
			itunes: {
				appId: "123456789",
				appArgument: "",
			},
		});

		expect(generateItunes(metadata)).toEqual([
			{
				name: "apple-itunes-app",
				content: "app-id=123456789",
			},
		]);
	});

	test("handles special characters in appArgument", () => {
		const metadata = normalizeMetadata({
			itunes: {
				appId: "123456789",
				appArgument: "myapp://open?param=value&other=123",
			},
		});

		expect(generateItunes(metadata)).toEqual([
			{
				name: "apple-itunes-app",
				content:
					"app-id=123456789, app-argument=myapp://open?param=value&other=123",
			},
		]);
	});
});

describe("generateFacebook", () => {
	test("returns an empty array when facebook is not provided", () => {
		expect(generateFacebook(normalizeMetadata({}))).toEqual([]);
	});

	test("emits app_id when provided", () => {
		const metadata = normalizeMetadata({
			facebook: {
				appId: "123",
			},
		});

		expect(generateFacebook(metadata)).toEqual([
			{ property: "fb:app_id", content: "123" },
		]);
	});

	test("emits only admins when app_id is absent", () => {
		const metadata = normalizeMetadata({
			facebook: {
				admins: ["admin-only"],
			},
		});

		expect(generateFacebook(metadata)).toEqual([
			{ property: "fb:admins", content: "admin-only" },
		]);
	});

	test("handles multiple admins", () => {
		const metadata = normalizeMetadata({
			facebook: {
				admins: ["admin1", "admin2", "admin3"],
			},
		});

		expect(generateFacebook(metadata)).toEqual([
			{ property: "fb:admins", content: "admin1" },
			{ property: "fb:admins", content: "admin2" },
			{ property: "fb:admins", content: "admin3" },
		]);
	});

	test("returns empty array when admins is empty", () => {
		const metadata = normalizeMetadata({
			facebook: {
				admins: [],
			},
		});

		expect(generateFacebook(metadata)).toEqual([]);
	});
});

describe("generatePinterest", () => {
	test("returns an empty array when pinterest is not provided", () => {
		expect(generatePinterest(normalizeMetadata({}))).toEqual([]);
	});

	test("emits rich pin flag when provided", () => {
		const metadata = normalizeMetadata({
			pinterest: { richPin: true },
		});

		expect(generatePinterest(metadata)).toEqual([
			{ property: "pinterest-rich-pin", content: "true" },
		]);
	});
});

describe("generateFormatDetection", () => {
	test("returns an empty array when formatDetection is not provided", () => {
		expect(generateFormatDetection(normalizeMetadata({}))).toEqual([]);
	});

	test("emits only disabled format-detection directives", () => {
		const metadata = normalizeMetadata({
			formatDetection: { telephone: false, date: true, email: false },
		});

		expect(generateFormatDetection(metadata)).toEqual([
			{
				name: "format-detection",
				content: "telephone=no, email=no",
			},
		]);
	});

	test("returns empty when all format-detection fields are enabled", () => {
		const metadata = normalizeMetadata({
			formatDetection: { telephone: true, address: true },
		});

		expect(generateFormatDetection(metadata)).toEqual([]);
	});

	test("handles all format-detection fields disabled", () => {
		const metadata = normalizeMetadata({
			formatDetection: {
				telephone: false,
				date: false,
				address: false,
				email: false,
				url: false,
			},
		});

		expect(generateFormatDetection(metadata)).toEqual([
			{
				name: "format-detection",
				content: "telephone=no, date=no, address=no, email=no, url=no",
			},
		]);
	});

	test("respects formatDetectionKeys order regardless of input order", () => {
		const metadata = normalizeMetadata({
			formatDetection: {
				url: false,
				telephone: false,
				email: false,
			},
		});

		expect(generateFormatDetection(metadata)).toEqual([
			{
				name: "format-detection",
				content: "telephone=no, email=no, url=no",
			},
		]);
	});
});

describe("generateVerification", () => {
	test("returns an empty array when verification is not provided", () => {
		expect(generateVerification(normalizeMetadata({}))).toEqual([]);
	});

	test("emits verification tags for known providers and custom entries", () => {
		const metadata = normalizeMetadata({
			verification: {
				google: ["g1", "g2"],
				yahoo: "yahoo-key",
				yandex: ["y1"],
				me: "@me",
				other: {
					"custom-site": ["c1", "c2"],
					another: "one",
				},
			},
		});

		expect(generateVerification(metadata)).toEqual([
			{ name: "google-site-verification", content: "g1" },
			{ name: "google-site-verification", content: "g2" },
			{ name: "y_key", content: "yahoo-key" },
			{ name: "yandex-verification", content: "y1" },
			{ name: "me", content: "@me" },
			{ name: "custom-site", content: "c1" },
			{ name: "custom-site", content: "c2" },
			{ name: "another", content: "one" },
		]);
	});

	test("handles nullish verification fields gracefully", () => {
		const metadata = normalizeMetadata({
			verification: {
				google: null,
				yahoo: undefined,
				yandex: [],
				me: "",
			},
		});

		expect(generateVerification(metadata)).toEqual([]);
	});

	test("handles mixed array and string values for custom entries", () => {
		const metadata = normalizeMetadata({
			verification: {
				other: {
					"site-a": "single",
					"site-b": ["multi1", "multi2"],
				},
			},
		});

		expect(generateVerification(metadata)).toEqual([
			{ name: "site-a", content: "single" },
			{ name: "site-b", content: "multi1" },
			{ name: "site-b", content: "multi2" },
		]);
	});
});

describe("generateAppleWebAppMeta", () => {
	test("returns an empty array when appleWebApp is not provided", () => {
		expect(generateAppleWebAppMeta(normalizeMetadata({}))).toEqual([]);
	});

	test("emits apple web app meta tags", () => {
		const metadata = normalizeMetadata({
			appleWebApp: {
				capable: true,
				title: "App Title",
				statusBarStyle: "black-translucent",
			},
		});

		expect(generateAppleWebAppMeta(metadata)).toEqual([
			{ name: "mobile-web-app-capable", content: "yes" },
			{ name: "apple-mobile-web-app-title", content: "App Title" },
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent",
			},
		]);
	});
});

describe("generateAppleWebAppLinks", () => {
	test("returns an empty array when startup images are not provided", () => {
		expect(generateAppleWebAppLinks(normalizeMetadata({}))).toEqual([]);
	});

	test("emits single startup image", () => {
		const metadata = normalizeMetadata({
			appleWebApp: {
				startupImage: [{ url: "https://example.com/startup.png" }],
			},
		});

		expect(generateAppleWebAppLinks(metadata)).toEqual([
			{
				rel: "apple-touch-startup-image",
				href: "https://example.com/startup.png",
			},
		]);
	});

	test("returns empty array when startupImage is empty array", () => {
		const metadata = normalizeMetadata({
			appleWebApp: {
				startupImage: [],
			},
		});

		expect(generateAppleWebAppLinks(metadata)).toEqual([]);
	});

	test("emits startup images with optional media", () => {
		const metadata = normalizeMetadata({
			appleWebApp: {
				startupImage: [
					{ url: "https://example.com/startup.png" },
					{
						url: "https://example.com/startup-dark.png",
						media: "(prefers-color-scheme: dark)",
					},
				],
			},
		});

		expect(generateAppleWebAppLinks(metadata)).toEqual([
			{
				rel: "apple-touch-startup-image",
				href: "https://example.com/startup.png",
			},
			{
				rel: "apple-touch-startup-image",
				href: "https://example.com/startup-dark.png",
				media: "(prefers-color-scheme: dark)",
			},
		]);
	});

	test("handles multiple images for different device sizes", () => {
		const metadata = normalizeMetadata({
			appleWebApp: {
				startupImage: [
					{
						url: "https://example.com/startup-iphone.png",
						media: "(device-width: 375px) and (device-height: 667px)",
					},
					{
						url: "https://example.com/startup-ipad.png",
						media: "(device-width: 768px) and (device-height: 1024px)",
					},
				],
			},
		});

		expect(generateAppleWebAppLinks(metadata)).toEqual([
			{
				rel: "apple-touch-startup-image",
				href: "https://example.com/startup-iphone.png",
				media: "(device-width: 375px) and (device-height: 667px)",
			},
			{
				rel: "apple-touch-startup-image",
				href: "https://example.com/startup-ipad.png",
				media: "(device-width: 768px) and (device-height: 1024px)",
			},
		]);
	});
});
