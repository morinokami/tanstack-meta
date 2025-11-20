import { expect, test } from "bun:test";

import { resolveTitle } from "./title";

test("returns trimmed title", () => {
	expect(resolveTitle(" Hello ")).toBe("Hello");
});

test("returns undefined for empty string", () => {
	expect(resolveTitle("")).toBeUndefined();
	expect(resolveTitle("   ")).toBeUndefined();
});

test("returns undefined for nullish", () => {
	expect(resolveTitle(undefined)).toBeUndefined();
	expect(resolveTitle(null)).toBeUndefined();
});
