import { describe, expect, test } from "bun:test";

import { resolveTitle } from "./title";

describe("resolveTitle", () => {
	describe("without titleTemplate", () => {
		test("passes through title unchanged", () => {
			const result = resolveTitle({ title: "My Page" });

			expect(result).toBe("My Page");
		});

		test("handles null title", () => {
			const result = resolveTitle({ title: null });

			expect(result).toBeNull();
		});

		test("handles undefined title", () => {
			const result = resolveTitle({});

			expect(result).toBeUndefined();
		});
	});

	describe("with titleTemplate", () => {
		const titleTemplate = { default: "My Site", template: "%s | My Site" };

		test("applies template to string title", () => {
			const result = resolveTitle({ title: "About" }, titleTemplate);

			expect(result).toBe("About | My Site");
		});

		test("uses default when title is null", () => {
			const result = resolveTitle({ title: null }, titleTemplate);

			expect(result).toBe("My Site");
		});

		test("uses default when title is undefined", () => {
			const result = resolveTitle({}, titleTemplate);

			expect(result).toBe("My Site");
		});

		test("ignores template when title is absolute", () => {
			const result = resolveTitle(
				{ title: { absolute: "Home" } },
				titleTemplate,
			);

			expect(result).toBe("Home");
		});

		test("handles absolute title with special characters", () => {
			const result = resolveTitle(
				{ title: { absolute: "Welcome | Special Page" } },
				titleTemplate,
			);

			expect(result).toBe("Welcome | Special Page");
		});
	});

	describe("template variations", () => {
		test("supports prefix template", () => {
			const result = resolveTitle(
				{ title: "Products" },
				{ default: "Home", template: "Acme | %s" },
			);

			expect(result).toBe("Acme | Products");
		});

		test("supports template without separator", () => {
			const result = resolveTitle(
				{ title: "Hello" },
				{ default: "Welcome", template: "%s" },
			);

			expect(result).toBe("Hello");
		});

		test("handles empty string title with template", () => {
			const result = resolveTitle(
				{ title: "" },
				{ default: "Default", template: "%s | Site" },
			);

			expect(result).toBe(" | Site");
		});

		test("replaces all %s placeholders", () => {
			const result = resolveTitle(
				{ title: "Docs" },
				{ default: "Site", template: "%s | %s | Site" },
			);

			expect(result).toBe("Docs | Docs | Site");
		});
	});
});
