import { describe, expect, test } from "bun:test";

import { resolveUrl } from "./utils";

describe("resolveUrl", () => {
	const baseUrl = "https://example.com";

	test("resolves relative path to absolute URL", () => {
		expect(resolveUrl("/path", baseUrl)).toBe("https://example.com/path");
	});

	test("resolves relative path without leading slash", () => {
		expect(resolveUrl("path", baseUrl)).toBe("https://example.com/path");
	});

	test("preserves absolute http URL", () => {
		expect(resolveUrl("http://other.com/path", baseUrl)).toBe(
			"http://other.com/path",
		);
	});

	test("preserves absolute https URL", () => {
		expect(resolveUrl("https://other.com/path", baseUrl)).toBe(
			"https://other.com/path",
		);
	});

	test("handles URL object as input", () => {
		expect(resolveUrl(new URL("/path", "https://localhost"), baseUrl)).toBe(
			"https://localhost/path",
		);
	});

	test("handles URL object as baseUrl", () => {
		expect(resolveUrl("/path", new URL("https://example.org"))).toBe(
			"https://example.org/path",
		);
	});
});
