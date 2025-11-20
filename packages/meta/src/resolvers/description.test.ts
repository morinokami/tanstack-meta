import { expect, test } from "bun:test";

import { resolveDescription } from "./description";

test("returns trimmed description", () => {
	expect(resolveDescription(" Hello ")).toBe("Hello");
});

test("returns undefined for empty string", () => {
	expect(resolveDescription("")).toBeUndefined();
	expect(resolveDescription("   ")).toBeUndefined();
});

test("returns undefined for nullish", () => {
	expect(resolveDescription(undefined)).toBeUndefined();
	expect(resolveDescription(null)).toBeUndefined();
});
