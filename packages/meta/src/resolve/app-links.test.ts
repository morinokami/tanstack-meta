import { describe, expect, test } from "bun:test";

import { resolveAppLinks } from "./app-links";

describe("resolveAppLinks", () => {
	describe("without baseUrl", () => {
		test("returns appLinks unchanged when baseUrl is not provided", () => {
			const appLinks = { ios: { url: "/app" } };
			const result = resolveAppLinks({ appLinks });

			expect(result).toBe(appLinks);
		});

		test("returns appLinks unchanged when baseUrl is null", () => {
			const appLinks = { ios: { url: "/app" } };
			const result = resolveAppLinks({ appLinks }, null);

			expect(result).toBe(appLinks);
		});

		test("returns undefined when appLinks is not provided", () => {
			const result = resolveAppLinks({});

			expect(result).toBeUndefined();
		});
	});

	describe("with baseUrl - ios", () => {
		const baseUrl = "https://example.com";

		test("resolves relative ios url", () => {
			const result = resolveAppLinks(
				{ appLinks: { ios: { url: "/app", app_store_id: "123456789" } } },
				baseUrl,
			);

			expect(result).toEqual({
				ios: { url: "https://example.com/app", app_store_id: "123456789" },
			});
		});

		test("resolves array of ios entries", () => {
			const result = resolveAppLinks(
				{
					appLinks: {
						ios: [
							{ url: "/app1", app_name: "App 1" },
							{ url: "/app2", app_name: "App 2" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				ios: [
					{ url: "https://example.com/app1", app_name: "App 1" },
					{ url: "https://example.com/app2", app_name: "App 2" },
				],
			});
		});

		test("preserves absolute URLs unchanged", () => {
			const result = resolveAppLinks(
				{ appLinks: { ios: { url: "https://other.com/app" } } },
				baseUrl,
			);

			expect(result).toEqual({ ios: { url: "https://other.com/app" } });
		});
	});

	describe("with baseUrl - iphone and ipad", () => {
		const baseUrl = "https://example.com";

		test("resolves iphone url", () => {
			const result = resolveAppLinks(
				{ appLinks: { iphone: { url: "/iphone-app" } } },
				baseUrl,
			);

			expect(result).toEqual({
				iphone: { url: "https://example.com/iphone-app" },
			});
		});

		test("resolves ipad url", () => {
			const result = resolveAppLinks(
				{ appLinks: { ipad: { url: "/ipad-app" } } },
				baseUrl,
			);

			expect(result).toEqual({ ipad: { url: "https://example.com/ipad-app" } });
		});
	});

	describe("with baseUrl - android", () => {
		const baseUrl = "https://example.com";

		test("resolves relative android url", () => {
			const result = resolveAppLinks(
				{
					appLinks: {
						android: { package: "com.example.app", url: "/android-app" },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				android: {
					package: "com.example.app",
					url: "https://example.com/android-app",
				},
			});
		});

		test("handles android entry without url", () => {
			const result = resolveAppLinks(
				{ appLinks: { android: { package: "com.example.app" } } },
				baseUrl,
			);

			expect(result).toEqual({ android: { package: "com.example.app" } });
		});

		test("resolves array of android entries", () => {
			const result = resolveAppLinks(
				{
					appLinks: {
						android: [
							{ package: "com.example.app1", url: "/app1" },
							{ package: "com.example.app2", url: "/app2" },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				android: [
					{ package: "com.example.app1", url: "https://example.com/app1" },
					{ package: "com.example.app2", url: "https://example.com/app2" },
				],
			});
		});
	});

	describe("with baseUrl - windows", () => {
		const baseUrl = "https://example.com";

		test("resolves windows url", () => {
			const result = resolveAppLinks(
				{ appLinks: { windows: { url: "/windows-app", app_id: "AppId" } } },
				baseUrl,
			);

			expect(result).toEqual({
				windows: { url: "https://example.com/windows-app", app_id: "AppId" },
			});
		});

		test("resolves windows_phone url", () => {
			const result = resolveAppLinks(
				{ appLinks: { windows_phone: { url: "/wp-app" } } },
				baseUrl,
			);

			expect(result).toEqual({
				windows_phone: { url: "https://example.com/wp-app" },
			});
		});

		test("resolves windows_universal url", () => {
			const result = resolveAppLinks(
				{ appLinks: { windows_universal: { url: "/uwp-app" } } },
				baseUrl,
			);

			expect(result).toEqual({
				windows_universal: { url: "https://example.com/uwp-app" },
			});
		});
	});

	describe("with baseUrl - web", () => {
		const baseUrl = "https://example.com";

		test("resolves web url", () => {
			const result = resolveAppLinks(
				{ appLinks: { web: { url: "/web-app", should_fallback: true } } },
				baseUrl,
			);

			expect(result).toEqual({
				web: { url: "https://example.com/web-app", should_fallback: true },
			});
		});

		test("resolves array of web entries", () => {
			const result = resolveAppLinks(
				{
					appLinks: {
						web: [
							{ url: "/web1", should_fallback: true },
							{ url: "/web2", should_fallback: false },
						],
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				web: [
					{ url: "https://example.com/web1", should_fallback: true },
					{ url: "https://example.com/web2", should_fallback: false },
				],
			});
		});
	});

	describe("with baseUrl - combined", () => {
		const baseUrl = "https://example.com";

		test("resolves all platform urls together", () => {
			const result = resolveAppLinks(
				{
					appLinks: {
						ios: { url: "/ios-app", app_store_id: "123" },
						android: { package: "com.example", url: "/android-app" },
						web: { url: "/web-app" },
					},
				},
				baseUrl,
			);

			expect(result).toEqual({
				ios: { url: "https://example.com/ios-app", app_store_id: "123" },
				android: {
					package: "com.example",
					url: "https://example.com/android-app",
				},
				web: { url: "https://example.com/web-app" },
			});
		});
	});
});
