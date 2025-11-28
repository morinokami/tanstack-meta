import { describe, expect, test } from "bun:test";

import { normalizeMetadata } from "../normalize";
import { generateViewport } from "./viewport";

describe("generateViewport", () => {
	test("returns empty array when viewport metadata is missing", () => {
		const metadata = normalizeMetadata({});

		expect(generateViewport(metadata)).toEqual([]);
	});

	test("emits viewport layout, theme-color entries, and color-scheme", () => {
		const metadata = normalizeMetadata({
			viewport: {
				width: "device-width",
				initialScale: 1,
				userScalable: false,
				themeColor: [
					{ color: "#000000" },
					{ color: "#ffffff", media: "(prefers-color-scheme: light)" },
				],
				colorScheme: "dark",
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, user-scalable=no",
			},
			{
				name: "theme-color",
				content: "#000000",
			},
			{
				name: "theme-color",
				content: "#ffffff",
				media: "(prefers-color-scheme: light)",
			},
			{
				name: "color-scheme",
				content: "dark",
			},
		]);
	});

	test("omits viewport meta when layout resolves empty but keeps theme-color", () => {
		const metadata = normalizeMetadata({
			viewport: {
				initialScale: 0,
				themeColor: "#eeeeee",
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "theme-color",
				content: "#eeeeee",
			},
		]);
	});

	test("omits theme-color entries when themeColor is null", () => {
		const metadata = normalizeMetadata({
			viewport: {
				width: "device-width",
				themeColor: null,
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "viewport",
				content: "width=device-width",
			},
		]);
	});

	test("omits theme-color entries when themeColor is an empty array", () => {
		const metadata = normalizeMetadata({
			viewport: {
				width: "device-width",
				themeColor: [],
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "viewport",
				content: "width=device-width",
			},
		]);
	});

	test("omits color-scheme meta when colorScheme is null", () => {
		const metadata = normalizeMetadata({
			viewport: {
				width: "device-width",
				colorScheme: null,
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "viewport",
				content: "width=device-width",
			},
		]);
	});

	test("emits only viewport meta when layout is provided without theme/color properties", () => {
		const metadata = normalizeMetadata({
			viewport: {
				width: "device-width",
				height: 800,
				initialScale: 1,
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "viewport",
				content: "width=device-width, height=800, initial-scale=1",
			},
		]);
	});

	test("emits multiple theme-color entries without media queries", () => {
		const metadata = normalizeMetadata({
			viewport: {
				themeColor: [{ color: "#000" }, { color: "#fff" }],
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{ name: "theme-color", content: "#000" },
			{ name: "theme-color", content: "#fff" },
		]);
	});

	test("emits color-scheme even without layout keys", () => {
		const metadata = normalizeMetadata({
			viewport: {
				colorScheme: "light",
			},
		});

		expect(generateViewport(metadata)).toEqual([
			{
				name: "color-scheme",
				content: "light",
			},
		]);
	});
});
